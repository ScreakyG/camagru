import { login } from "../controllers/auth/login.js";
import { register } from "../controllers/auth/register.js";
import { logout } from "../controllers/auth/logout.js";
import { verifyAccount, verifyResetPasswordToken } from "../controllers/auth/verify.js";
import { forgotPassword } from "../controllers/auth/forgot-password.js";
import { resetPassword } from "../controllers/auth/reset-password.js";
import { resendValidationLink } from "../controllers/auth/resend-validation-email.js";

import registerSchema from "../validators/auth/registerSchema.js";
import loginSchema from "../validators/auth/loginSchema.js";
import forgotPasswordSchema from "../validators/auth/forgotPasswordSchema.js"
import resetPasswordSchema from "../validators/auth/resetPasswordSchema.js";
import resendValidationSchema from "../validators/auth/resendValidationSchema.js";

async function authRoutes(fastify, options) {
    // POST
    fastify.post("/register", registerSchema, register);
    fastify.post("/login", loginSchema, login);
    fastify.post("/logout", logout);
    fastify.post("/forgot-password", forgotPasswordSchema ,forgotPassword);
    fastify.post("/reset-password", resetPasswordSchema, resetPassword);
    fastify.post("/resend-validation-link", resendValidationSchema , resendValidationLink);

    // GET
    fastify.get("/verify", verifyAccount);
    fastify.get("/validate-reset-link", verifyResetPasswordToken);
}

export default authRoutes;
