import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { findUserById, updateNotificationsState } from "../../models/querys.js";

export async function toggleNotifications(request, reply) {
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

        if (!request.body)
            throw new BadRequestError("Missing body in request.");

        const { newNotificationsState } = request.body;
        if (newNotificationsState === undefined || null)
            throw new BadRequestError("Missing new notifications state.");
        
        const result = await updateNotificationsState(newNotificationsState, user);

        return (reply.send({message: "Enabled/Disabled notifications.", updatedState: newNotificationsState}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.send({success: false, message: "Internal server error", details: error.message}));
    }
}
