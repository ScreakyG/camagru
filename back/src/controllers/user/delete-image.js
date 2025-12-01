import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyAuthToken } from "../../utils/jwt.js";
import { deleteImageById, findUserById, getImageById } from "../../models/querys.js";

import fs from "node:fs/promises";
import path from "node:path";

export async function deleteImage(request, reply) {
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

        const { id } = request.params;
        if (!id)
            throw new BadRequestError("Missing image id parameter.");

        const image = await getImageById(id);
        if (!image)
            throw new BadRequestError("Image does not exist.");

        // Verifier que l'user possede l'image.
        if (user.id !== image.user_id)
            throw new BadRequestError("You do not own this image.");

        await deleteImageById(image.id);

        const imagePath = path.join(process.cwd(), image.img_path);

        try
        {
            await fs.access(imagePath);
            await fs.unlink(imagePath);
        }
        catch (error)
        {
            console.log("Could not delete image from filesystem : ", error);
        }

        return (reply.send({success: true, message: `Sucessfully deleted image with id : ${image.id}`}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}
