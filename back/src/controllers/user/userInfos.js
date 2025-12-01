import { AuthenticationError } from "../../utils/errors.js";
import { verifyAuthToken } from "../../utils/jwt.js";
import { findUserById } from "../../models/querys.js";

export async function userInfos(request, reply) {
    try
    {
        const token = request.cookies.auth_token;
        if (!token)
            throw new AuthenticationError("Could not find auth_token in cookies")

        const decodedToken = await verifyAuthToken(token);
        if (!decodedToken)
            throw new AuthenticationError("Auth_token is invalid/expired");

        const user = await findUserById(decodedToken.id);
        if (!user)
            throw new AuthenticationError(`Couldn't find a user with id : ${decodedToken.id}`);

        return (reply.send({ success: true, user: { id: decodedToken.id, email: user.email, username: user.username, notifications: user.notifications }}));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({ success: false, errorMessage: error.message }));
        return (reply.code(500).send({ success: false, errorMessage: error.message }));
    }
}
