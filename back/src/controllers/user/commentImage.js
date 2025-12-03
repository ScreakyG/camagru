import { verifyAuthToken } from "../../utils/jwt.js";
import { AuthenticationError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import { findUserById, getImageById, insertCommentPost } from "../../models/querys.js";
import { getAllImageComments } from "../../models/querys.js";
import { sendCommentNotificationMail } from "../../services/mailService.js";

async function notifyOwnerByMail(ownerId) {
    try
    {
        if (!ownerId)
            throw new Error("ownerId is invalid.");

        const owner = await findUserById(ownerId);
        if (!owner)
            throw new Error(`Could not find a user with this id : ${ownerId}`);

        if (owner.notifications)
            await sendCommentNotificationMail(owner);
    }
    catch(error)
    {
        console.log("Could not send nofication mail : ", error);
    }
}

function isValidComment(comment) {
    if (!comment)
        return (false);

    comment = comment.trim();
    if (comment.length < 1 || comment.length > 30)
        return (false);

    return (true);
}

// TODO : Parser le comment cote back.
export async function commentImage(request, reply) {
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


        if (!request.body)
            throw new BadRequestError("Missing body in request.");

        const { image_id } = request.params;
        if (!image_id)
            throw new BadRequestError("Missing image id.");

        const image = await getImageById(image_id);
        if (!image)
            throw new NotFoundError("Image not found.");

        // Parser le comment
        console.log(request.body);
        const { comment } = request.body;
        if (!isValidComment(comment))
            throw new BadRequestError("Comment does not meet criterias (Min 1 character, max 30)");

        // Inserer le commentaire en DB.
        const result = await insertCommentPost(user, comment.trim(), image_id);
        notifyOwnerByMail(image.user_id);

        return reply.code(201).send({success: true, message: "Image commented.", comment: {username: user.username, content: comment}});
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
