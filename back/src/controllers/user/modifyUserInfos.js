import { findUserById } from "../../models/querys.js";
import { AuthenticationError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { verifyEmailInput, verifyUsernameInput } from "../../validators/validation_rules.js";

export async function modifyUserInfos(request, reply) {
    try
    {
        const auth_token = request.cookies.auth_token;
        if (!auth_token)
            throw new AuthenticationError("Could not find auth_token in cookies.");

        const decodedToken = verifyJWT(auth_token);
        if (!decodedToken)
            throw new AuthenticationError("Auth_token is invalid/expired.");

        if (!request.body)
            throw new BadRequestError("Missing body in request.");

        const { username, email } = request.body;
        const newUsername = verifyUsernameInput(username);
        const newEmail = verifyEmailInput(email);

        console.log("new username : " + newUsername);
        console.log("new email : " + newEmail);

        const user = await findUserById(decodedToken.id);
        console.log("user : ", user);

        /**
         * TODO :
         *  - Trancher pour savoir si je fais la verification si le username est deja pris en JS ou SQL.
         *  - Update seulement si le username n'est pas le meme, verifier en JS ou SQL ?
         */

        return (reply.code(200).send({ success: true, message: 'All good' }));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({ success: false, errorMessage: error.message }));
        return (reply.code(500).send({ success: false, errorMessage: "Internal server error", details: error.message }));
    }
}
