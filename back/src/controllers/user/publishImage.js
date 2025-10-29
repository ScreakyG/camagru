import { BadRequestError } from "../../utils/errors.js";

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
    console.log("Selected overlay = ", overlayRequested);

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
    console.log("Uploaded file = ", inputFile);

    if (!inputFile)
        return (false);

    for (let i = 0; i < allowedInputFileFormat.length; i++)
    {
        if (inputFile.mimetype === allowedInputFileFormat[i])
            return (true);
    }
    return (false);
}

export async function publishImage(request, reply) {
    let uploadedFile = null;
    let uploadedFileMetadata = null
    let overlayRequested = null;
    let overlayParsed = null;

    try
    {
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

        return (reply.send({success: true, message: "Endpoint success call"}));
    }
    catch(error)
    {
        console.log("CATCHED ERROR = ", error);
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}))
        return (reply.send({success: false, message: "Error with uploaded file/selected overlay."}))
    }
}
