import { login } from "./auth/login.js";
import { register } from "./auth/register.js";
import { logout } from "./auth/logout.js";
import { verifyAccount } from "./auth/verify.js";

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

const loginSchema = {
    body: {
        type: 'object',
        required: ["username", "password"],
        properties: {
            username: {
                type: "string",
                maxLength: 30
            },
            password: {
                type: "string",
                maxLength: 128
            }
        },
        additionalProperties: false
    }
};

function forgotPassword(request, reply) {
    return reply.send({message: "okok"});
}

async function authRoutes(fastify, options) {
    fastify.post("/register", { schema: registerSchema }, register);
    fastify.post("/login", { schema: loginSchema }, login);
    fastify.post("/logout", logout);
    fastify.post("/forgot-password", forgotPassword);
    fastify.get("/verify", verifyAccount);
}

export default authRoutes;
