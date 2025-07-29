import { decryptPassword } from "../../utils/encrypt.js";
import { findUserByUsername, findUserByEmail } from "../../db/querys.js";
import { AuthenticationError } from "../../utils/errors.js";
import { createJWT } from "../../utils/jwt.js";


export async function login(request, reply) {
    try
    {
        let {username, password} = request.body;

        const user = await findUserByUsername(username);
        if (!user)
            throw new AuthenticationError("Username/Password not valid");

        const result = await decryptPassword(password, user.password);
        if (!result)
            throw new AuthenticationError("Username/Password not valid");

        const token = createJWT(user);
        reply.setCookie("auth_token", token, {
            httpOnly: true, // Non accessible avec JavaScript.
            secure: false, // Mettre en true si en HTTPS.
            sameSite: "strict",
            path: "/"
        })

        return (reply.code(200).send({ message: "Login successful" }));
    }
    catch(error)
    {
        // It means that its a error that we throw ourself.
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        // It is a error that we did not handle. (We should avoid this at all cost).
        else
            return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}
