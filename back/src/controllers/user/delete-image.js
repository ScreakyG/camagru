import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { findUserById, getImageById } from "../../models/querys.js";

export async function deleteImage(request, reply) {
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

        const { id } = request.params;
        if (!id)
            throw new BadRequestError("Missing image id parameter.");

        const image = await getImageById(id);
        console.log("Image to delete = ", image);
        if (!image)
            throw BadRequestError("Image does not exist.");

        // TODO : Verifier que l'user possede l'image.
        if (user.id !== image.user_id)
            throw new BadRequestError("You do not own this image.");

        // TODO : Supprimer l'image.

        return (reply.send({success: true, message: `Sucessfully deleted image : ${image.id}`}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}
