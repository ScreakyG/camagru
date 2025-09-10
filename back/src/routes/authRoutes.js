import { login } from "../controllers/auth/login.js";
import { register } from "../controllers/auth/register.js";
import { logout } from "../controllers/auth/logout.js";
import { verifyAccount, verifyResetPasswordToken } from "../controllers/auth/verify.js";
import { forgotPassword } from "../controllers/auth/forgot-password.js";
import { resetPassword } from "../controllers/auth/reset-password.js";
import { resendValidationLink } from "../controllers/auth/resend-validation-email.js";

import schemas from "../validators/authSchemas.js"


async function authRoutes(fastify, options) {
    // POST
    fastify.post("/register", { schema: schemas.registerSchema }, register);
    fastify.post("/login", { schema: schemas.loginSchema }, login);
    fastify.post("/logout", logout);
    fastify.post("/forgot-password", { schema: schemas.forgotPasswordSchema } ,forgotPassword);
    fastify.post("/reset-password", { schema: schemas.resetPasswordSchema }, resetPassword);
    fastify.post("/resend-validation-link", { schema: schemas.resendValidationSchema }, resendValidationLink);

    // GET
    fastify.get("/verify", verifyAccount);
    fastify.get("/validate-reset-link", verifyResetPasswordToken);
}

export default authRoutes;
