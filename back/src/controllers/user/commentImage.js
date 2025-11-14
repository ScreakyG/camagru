import { verifyJWT } from "../../utils/jwt.js";
import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { findUserById, getImageById, insertCommentPost } from "../../models/querys.js";
import { getAllImageComments } from "../../models/querys.js";

// TODO : Parser le comment cote back.
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

        // Parser le comment
        const { comment } = request.body;
        if (!comment)
            throw new BadRequestError("Comment is not valid.");

        // Inserer le commentaire en DB.
        const result = await insertCommentPost(user, comment, image_id);

        return reply.send({success: true, message: "Image commented.", comment: {username: user.username, content: comment}});
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}

// Retourne les commentaires link a une image
export async function getImageComments(request, reply) {
    try
    {
        const { image_id } = request.params;
        if (!image_id)
            throw new BadRequestError("Missing image id.");

        const imageComments = await getAllImageComments(image_id);
        // console.log(`Comments for image with id ${image_id} : `, imageComments);

        return (reply.send({success: true, comments: imageComments}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}
