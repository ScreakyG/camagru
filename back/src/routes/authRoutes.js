import { verifyEmailInput, verifyPasswordInput, verifyUsernameInput } from "../utils/validation.js";

const registerSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
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
            1/ Verifier que le schema de la requete est bon.
            2/ Valider / Sanitize le body.
            3/ Verifier que le mail / username n'est pas deja utilise.
            4/ Hasher le mot de passe.
            5/ Store dans la DB.
        */
        try
        {
            console.log("Request body : ", request.body);
            let { username, email, password } = request.body;

            // Verifie le format et rejette en cas de caracteres innatendus.
            username = verifyUsernameInput(username);
            email = verifyEmailInput(email);
            password = verifyPasswordInput(password);

            console.log("After validation/sanitize : ", {
                username: username,
                email: email,
                password: password
            })
        }
        catch(error)
        {
            return (reply.code(400).send({ success: false, message: error.message }))
        }
        return (reply.code(200).send({ success: true, message:"Succesfully registered" }));
    })
}

export default authRoutes;
