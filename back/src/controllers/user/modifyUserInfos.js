import { findUserByEmail, findUserById, findUserByUsername } from "../../models/querys.js";
import { getDB } from "../../services/db.js";
import { AuthenticationError, ConflictError } from "../../utils/errors.js";
import { verifyJWT } from "../../utils/jwt.js";
import { verifyEmailInput, verifyUsernameInput } from "../../validators/validation_rules.js";
import { updateEmail, updateUsername } from "../../models/querys.js";

async function tryUpdateEmail(user, newEmail) {
    try
    {
        await updateEmail(user, newEmail);
    }
    catch (error)
    {
        console.log(error);
        if (error.code === "SQLITE_CONSTRAINT")
            return ({field: "email", message: "Email is already in use."});
        return ({field: "email", message: error.code});
    }
}

async function tryUpdateUsername(user, newUsername) {
    try
    {
        await updateUsername(user, newUsername);
    }
    catch (error)
    {
        console.log(error);
        if (error.code === "SQLITE_CONSTRAINT")
            return ({field: "username", message: "Username is already in use."});
        return ({field: "username", message: error.code});
    }
}


export async function modifyUserInfos(request, reply) {
    try
    {
        /**
         * AMELIORATIONS POSSIBLES:
         *  - Faut il renvoyer un lien d'activation de mail si on change ?
         *  - Renvoyer les champs qui on ete changes.
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

        if (newEmail === user.email && newUsername === user.username)
            return (reply.code(204)); // Rien ne se passe donc on renvoi une reponse vide.

        let error;
        const conflict_errors = [];

        error = await tryUpdateEmail(user, newEmail);
        if (error)
            conflict_errors.push(error);

        error = await tryUpdateUsername(user, newUsername);
        if (error)
            conflict_errors.push(error);

        if (conflict_errors.length > 0)
            return (reply.code(409).send({ success: false, conflict_errors: conflict_errors }));

        return (reply.code(200).send({ success: true, message: 'User informations updated' }));
    }
    catch (error)
    {
        if (error.statusCode)
            return (reply.code(error.statusCode).send({ success: false, errorMessage: error.message }));
        return (reply.code(500).send({ success: false, errorMessage: "Internal server error", details: error.message }));
    }
}
