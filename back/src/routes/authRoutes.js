import { login } from "./auth/login.js";
import { register } from "./auth/register.js";
import { logout } from "./auth/logout.js";
import { verifyAccount, verifyResetPasswordToken } from "./auth/verify.js";
import { forgotPassword } from "./auth/forgot-password.js";
import { resetPassword } from "./auth/reset-password.js";
import { resendValidationLink } from "./auth/resend-validation-email.js";

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

const forgotPasswordSchema = {
    body: {
        type: "object",
        required: ["email"],
        properties: {
            email: {
                type: "string",
                format: "email",
                maxLength: 255
            }
        }
    }
};

async function authRoutes(fastify, options) {
    // POST
    fastify.post("/register", { schema: registerSchema }, register);
    fastify.post("/login", { schema: loginSchema }, login);
    fastify.post("/logout", logout);
    fastify.post("/forgot-password", { schema: forgotPasswordSchema } ,forgotPassword);
    fastify.post("/reset-password", resetPassword);
    fastify.post("/resend-validation-link", resendValidationLink);

    // GET
    fastify.get("/verify", verifyAccount);
    fastify.get("/validate-reset-link", verifyResetPasswordToken);
}

export default authRoutes;
