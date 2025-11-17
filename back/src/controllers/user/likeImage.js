import { insertLikeImage, removeLikeImage, findUserById, getImageById, getImageLikes } from "../../models/querys.js";
import { AuthenticationError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";

/**
 * Fonction qui essaye d'inserer un like dans la db.
 * Si user a deja like le post alors il va l'unlike.
 */
export async function likeImage(request, reply) {
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
            throw new NotFoundError("Image not found.");

        try
        {
            await insertLikeImage(user.id, image_id);
        }
        catch (error)
        {
            if (error.code === "SQLITE_CONSTRAINT") // Signifie que l'user a deja like l'image.
            {
                await removeLikeImage(user.id, image_id);
                const imageLikes = await getImageLikes(image_id);
                return (reply.send({success: true, message: `User ${user.id} unliked image ${image_id}`, liked: false, likes_count: imageLikes.length}));
            }
            else
                throw new Error(error);
        }

        const imageLikes = await getImageLikes(image_id);
        return reply.send({success: true, message:`User ${user.id} liked image ${image_id}`, liked: true, likes_count: imageLikes.length});
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}
