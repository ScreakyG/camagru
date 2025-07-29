import { signin } from "./auth/login.js";
import { register } from "./auth/register.js";

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
    fastify.post("/register", { schema: registerSchema }, register);
    fastify.post("/login", signin);
}

export default authRoutes;
