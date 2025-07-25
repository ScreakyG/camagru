import { createUser} from "../db/querys.js";
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
            1/ Verifier que le schema de la requete est bon. OK
            2/ Valider / Sanitize le body. OK
            3/ Verifier que le mail / username n'est pas deja utilise. OK
            
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

            const newUser = await createUser(email, username, password);

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
