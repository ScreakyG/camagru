import { getAllUserImages, findUserById, getAllPosts, getImageLikes, getAllImageComments, getLimitedPosts } from "../../models/querys.js";
import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyAuthToken} from "../../utils/jwt.js";


export async function getUserImages(request, reply) {
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

        const userImages = await getAllUserImages(user);
        // console.log(`All images from user id : ${user.id}`, userImages);

         return (reply.send({success: true, user_images: userImages}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}))
    }
}

// Retourne les posts formater avec les informations necessaires a la composition d'un post.
export async function getGalleryPosts(request, reply) {
    if (!request.query.page || !request.query.limit)
        throw new BadRequestError("Specify a page and a limit");

    const page = parseInt(request.query.page);
    const limit = parseInt(request.query.limit);

    if (Number.isNaN(page) || Number.isNaN(limit))
        throw new BadRequestError("Specified values are not valid");
    if (page < 0 || limit < 0 || limit > 50)
        throw new BadRequestError("Page should be >= 0 and limit between 1 and 50");

    console.log({page, limit});
    const offset = page * limit;

    try
    {
        // Retourne les rows des images et le username correspondant a l'user_id
        const allImages = await getLimitedPosts(limit, offset);
        for (let i = 0; i < allImages.length; i++)
        {
            const imageLikes = await getImageLikes(allImages[i].id);
            allImages[i].liked_by = imageLikes;
            const imageComments = await getAllImageComments(allImages[i].id);
            allImages[i].comments = imageComments;
        }

        return (reply.send({success: true, all_images: allImages}));
    }
    catch (error)
    {
       return (reply.send({success: false, message: "Internal server error", details: error.message}));
    }
}
