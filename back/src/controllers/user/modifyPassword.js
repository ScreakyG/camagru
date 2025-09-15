import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { verifyPasswordInput } from "../../validators/validation_rules.js";
import { verifyJWT } from "../../utils/jwt.js";

export async function modifyPassword(request, reply) {
    try
    {
        /**
         * TODO:
         *  - Update le password dans la DB.
         */
        const auth_token = request.cookies.auth_token;
        if (!auth_token)
            throw new AuthenticationError("Could not find auth_token in cookies.");

        const decodedToken = verifyJWT(auth_token);
        if (!decodedToken)
            throw new AuthenticationError("Auth_token is invalid/expired.");

        console.log(decodedToken);

        if (!request.body)
            throw new BadRequestError("Missing body in request.");

        let { newPassword } = request.body;
        newPassword = verifyPasswordInput(newPassword);

         return ({success: true, message: "Password successfully changed.", newPassword: newPassword});
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}
