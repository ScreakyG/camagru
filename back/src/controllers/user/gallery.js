import { getAllUserImages, findUserById } from "../../models/querys.js";
import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";

export async function getUserImages(request, reply) {
    try
    {
        console.log("HELLLLLLO")

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
