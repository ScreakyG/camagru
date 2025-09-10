import { decryptPassword } from "../../utils/encrypt.js";
import { findUserByUsername } from "../../models/querys.js";
import { AuthenticationError, BadRequestError } from "../../utils/errors.js";
import { createJWT } from "../../utils/jwt.js";
import { verifyPasswordInput, verifyUsernameInput } from "../../utils/validation.js";


export async function login(request, reply) {
    try
    {
        if (!request.body)
            throw new BadRequestError("Missing body content in request.");

        let {username, password} = request.body;

        username = verifyUsernameInput(username);
        password = verifyPasswordInput(password);

        const user = await findUserByUsername(username);
        if (!user)
            throw new AuthenticationError("Username/Password not valid");

        const result = await decryptPassword(password, user.password_hash);
        if (!result)
            throw new AuthenticationError("Username/Password not valid");

        if (!user.is_verified)
            return (reply.code(403).send({success: false, errorMessage: "Account is not validated", email: user.email}))

        const token = createJWT(user);
        reply.setCookie("auth_token", token, {
            httpOnly: true, // Non accessible avec JavaScript.
            secure: false, // Mettre en true si en HTTPS.
            sameSite: "strict",
            path: "/"
        })

        return (reply.code(200).send({success: true, message: "Login successful" }));
    }
    catch(error)
    {
        /*
        *   If the username or password is not respecting our rules it already means it
        *   failed, instead of saying why we just say its not valid.
        *   This we can still verify that inputs meets what is expected.
        */
        if (error.name === "ValidationError")
            return (reply.code(401).send({success: false, errorMessage: "Username/Password not valid"}));

        // It means that its a error that we throw ourself.
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        // It is a error that we did not handle. (We should avoid this at all cost).
        else
            return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}
