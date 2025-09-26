import { findUserByEmail, findUserById, findUserByUsername } from "../../models/querys.js";
import { AuthenticationError, ConflictError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { verifyEmailInput, verifyUsernameInput } from "../../validators/validation_rules.js";

export async function modifyUserInfos(request, reply) {
    try
    {
        /**
         * TODO :
         *  - Update les changements dans la DB.
         */

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

        const user = await findUserById(decodedToken.id);
        if (!user)
           throw new AuthenticationError("Auth_token is invalid/expired.");

        console.log("user : ", user);
        console.log("new username : " + newUsername);
        console.log("new email : " + newEmail);

        const emailTaken = await findUserByEmail(newEmail);
        const usernameTaken = await findUserByUsername(newUsername);

        if (newUsername !== user.username && newEmail !== user.username)
        {
            if (emailTaken && usernameTaken)
                throw new ConflictError("Email & username are already taken.");
        }
        if (newEmail !== user.email)
        {
            if (emailTaken)
                throw new ConflictError("Email is already taken.");
        }
        if (newUsername !== user.username)
        {
            if (usernameTaken)
                throw new ConflictError("Username is already taken.");
        }


        return (reply.code(200).send({ success: true, message: 'User informations updated' }));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({ success: false, errorMessage: error.message }));
        return (reply.code(500).send({ success: false, errorMessage: "Internal server error", details: error.message }));
    }
}
