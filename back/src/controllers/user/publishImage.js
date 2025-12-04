import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyAuthToken } from "../../utils/jwt.js";
import { findUserById, getImageById, linkImageToUser } from "../../models/querys.js";

import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp from "sharp";


// Dossier ou seront stock les images des users.
const uploadDir = path.join(process.cwd(), "uploads");
// Create uploads DIR (does nothing is already exists)
await fs.mkdir(uploadDir, { recursive: true });


const availableOverlays = [
    { id: 0, name: "frost_frame", path: "/overlays/frost_frame.png", imgEl : null},
    { id: 1, name: "pixel_glasses", path:"/overlays/pixel_glasses.png", imgEl : null},
    { id: 3, name: "cat_selfie", path: "/overlays/cat_selfie.png", imgEl: null},
    { id: 4, name: "smile_glasses", path: "/overlays/smile_glasses.png", imgEl: null},
];

const allowedInputFileFormat = [
    "image/jpeg",
    "image/png"
];

export async function getAvailableOverlays(request, reply) {
    return (reply.send(availableOverlays));
}


function parseOverlay(overlayRequested) {
    // console.log("Selected overlay = ", overlayRequested);

    if (!overlayRequested)
        return (null);
    if (overlayRequested.fieldname !== "overlay" || !overlayRequested.value)
        return (null);

    for (let i = 0; i < availableOverlays.length; i++)
    {
        if (overlayRequested.value === availableOverlays[i].name)
            return (overlayRequested.value)
    }
    return (null);
}

async function isValidImageFile(inputFile, fileBuffer) {
    if (!inputFile)
        return (false);

    // Verifie si le mimetype est accepte par le serveur.
    if (!allowedInputFileFormat.includes(inputFile.mimetype))
        return (false);

    try
    {
        // Va essayer d'ouvrir le fichier, cela nous permet de savoir si le fichier est vraiment une image, cela echouera si il contient autre chose que de l'image.
        const metadata = await sharp(fileBuffer).metadata();
        // console.log("Metadata : ", metadata);
        return (true);
    }
    catch (error)
    {
        console.log("Error when opening input file : ", error);
        return (false);
    }
}

async function createComposedImage(imageFile, overlay) {
    // Redimensionnement image de base.
    const downscaled = await sharp(imageFile)
        .rotate()
        .resize({width: 1080, withoutEnlargement: true})
        .jpeg({quality: 92})
        .toBuffer();

    // Recupere les dimensions de l'image uploadee.
    const base = sharp(downscaled).rotate();
    const meta = await base.metadata();
    // console.log("Metadata base image = ", meta);

    // Chargement + redimensionner l'overlay pour fit sur l'image uploadee.
    const overlayPath = path.join(process.cwd(), "overlays", `${overlay}.png`); // Recup le path du fichier dans le back.
    const overlayImgResized = await sharp(overlayPath)
        .resize({ width: meta.width, height: meta.height, fit: "fill" })
        .png()
        .toBuffer();

    // Fusion des 2 images.
    const composed = await base.composite([{input : overlayImgResized}])
        .png()
        .toBuffer();

    // Sauvegarder le resultat.
    const uuid = randomUUID();
    const imageSavePath = path.join(uploadDir, `${uuid}.png`);
    await fs.writeFile(imageSavePath, composed);

    const frontPath = path.join(`/uploads/${uuid}.png`);

    return (frontPath);
    //
}

export async function publishImage(request, reply) {
    let uploadedFile = null;
    let uploadedFileMetadata = null
    let overlayRequested = null;
    let overlayParsed = null;

    try
    {
        // Auth check
        const auth_token = request.cookies.auth_token;
        if (!auth_token)
            throw new AuthenticationError("Could not find auth_token in cookies.");

        const decodedToken = await verifyAuthToken(auth_token);
        if (!decodedToken)
            throw new AuthenticationError("Auth_token is invalid/expired.");

        const user = await findUserById(decodedToken.id);
        if (!user)
            throw new AuthenticationError(`Couldn't find a user with id: ${decodedToken.id}`);
        //


        const parts = request.parts();
        for await (const part of parts)
        {
            if (part.type === "file")
            {
                uploadedFileMetadata = part;
                uploadedFile = await part.toBuffer();
            }
            else if (part.type === "field")
                overlayRequested = part;
        }

        const isValid = await isValidImageFile(uploadedFileMetadata, uploadedFile);
        if (!isValid)
            throw new BadRequestError("Uploaded file is not a image.");

        overlayParsed = parseOverlay(overlayRequested);
        if (!overlayParsed)
            throw new BadRequestError("Requested filter is not valid.");

        const imagePath = await createComposedImage(uploadedFile, overlayParsed);
        const imageId = await linkImageToUser(imagePath, user);
        const imageMetadata = await getImageById(imageId);

        return (reply.code(201).send({success: true, message: "Image successfuly composed and saved.", image_metadata: imageMetadata}));
    }
    catch(error)
    {
        console.log("CATCHED ERROR = ", error);
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}))
        return (reply.code(500).send({success: false, message: "Internal server error", details: error.message}))
    }
}
