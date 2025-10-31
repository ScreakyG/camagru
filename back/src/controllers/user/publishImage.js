import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { findUserById, linkImageToUser } from "../../models/querys.js";

import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp from "sharp";


// Dossier ou seront stock les images des users.
const uploadDir = path.join(process.cwd(), "uploads");
// Create uploads DIR (does nothing is already exists)
await fs.mkdir(uploadDir, { recursive: true });

const availableOverlays = [
    "frost_frame",
    "cat_selfie",
    "pixel_glasses",
    "smile_glasses"
];

const allowedInputFileFormat = [
    "image/jpeg",
    "image/png"
];

function parseOverlay(overlayRequested) {
    // console.log("Selected overlay = ", overlayRequested);

    if (!overlayRequested)
        return (null);
    if (overlayRequested.fieldname !== "overlay" || !overlayRequested.value)
        return (null);

    for (let i = 0; i < availableOverlays.length; i++)
    {
        if (overlayRequested.value === availableOverlays[i])
            return (overlayRequested.value)
    }
    return (null);
}

function isValidImageFile(inputFile) {
    // console.log("Uploaded file = ", inputFile);

    if (!inputFile)
        return (false);

    for (let i = 0; i < allowedInputFileFormat.length; i++)
    {
        if (inputFile.mimetype === allowedInputFileFormat[i])
            return (true);
    }
    return (false);
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
    const overlayPath = path.join(process.cwd(), "overlays", `${overlay}.png`);
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

        const decodedToken = verifyJWT(auth_token);
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

        if (!isValidImageFile(uploadedFileMetadata))
            throw new BadRequestError("Uploaded file is not a image.");

        overlayParsed = parseOverlay(overlayRequested);
        if (!overlayParsed)
            throw new BadRequestError("Requested filter is not valid.");

        const imagePath = await createComposedImage(uploadedFile, overlayParsed);
        const imageId = await linkImageToUser(imagePath, user);

        return (reply.send({success: true, message: "Image successfuly composed and saved.", image_metadata: { id: imageId, path: imagePath }}));
    }
    catch(error)
    {
        console.log("CATCHED ERROR = ", error);
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}))
        return (reply.send({success: false, message: "Error with uploaded file/selected overlay."}))
    }
}
