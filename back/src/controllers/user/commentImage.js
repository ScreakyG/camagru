import { verifyJWT } from "../../utils/jwt.js";
import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { findUserById, getImageById, insertCommentPost } from "../../models/querys.js";

export async function commentImage(request, reply) {
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

        const { image_id } = request.params;
        if (!image_id)
            throw new BadRequestError("Missing image id.");

        const image = await getImageById(image_id);
        if (!image)
            throw new BadRequestError("No image exists with this id.");

        // Parser le comment ?
        const comment = "Nice picture !";
        // Inserer le commentaire en DB.
        const result = await insertCommentPost(user, comment, image_id);
        console.log("Resultat du commentaire :", result);


        return reply.send({success: true, message: "Image commented.", comment: comment});
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}
