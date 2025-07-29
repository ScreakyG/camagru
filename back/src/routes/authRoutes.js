import { createUser } from "../db/querys.js";
import { verifyEmailInput, verifyPasswordInput, verifyUsernameInput } from "../utils/validation.js";
import { createJWT } from "../utils/jwt.js";

const registerSchema = {
    body: {
        type: 'object',
        required: ["username", "email", "password"],
        properties: {
            username: {
                type: "string",
                minLength: 3,
                maxLength: 30
            },
            email: {
                type: "string",
                format: 'email',
                maxLength: 255
            },
            password: {
                type: "string",
                minLength: 8,
                maxLength: 128
            }
        },
        additionalProperties: false
    }
};

async function authRoutes(fastify, options) {
    fastify.post("/register", { schema: registerSchema }, async (request, reply) => {

        /* TODO
            1/ Hasher le mot de passe.
            2/ Store dans la DB.
        */
        try
        {
            console.log("Request body : ", request.body);
            let { username, email, password } = request.body;

            // Verifie le format et rejette en cas de caracteres innatendus.
            username = verifyUsernameInput(username);
            email = verifyEmailInput(email);
            password = verifyPasswordInput(password);

            const newUser = await createUser(email, username, password);
            const token = createJWT(newUser);
            if (!token)
                throw new Error("Error while creating JWT");

            reply.setCookie("auth_token", token, {
                httpOnly: true, // Non accessible avec JavaScript.
                secure: false, // Mettre en true si en HTTPS.
                sameSite: "strict",
                path: "/"
            })
            return (reply.code(201).send({ success: true, message:"Succesfully registered", user: newUser }));
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
    })
}

export default authRoutes;
