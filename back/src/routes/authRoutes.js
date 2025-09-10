import { login } from "../controllers/auth/login.js";
import { register } from "../controllers/auth/register.js";
import { logout } from "../controllers/auth/logout.js";
import { verifyAccount, verifyResetPasswordToken } from "../controllers/auth/verify.js";
import { forgotPassword } from "../controllers/auth/forgot-password.js";
import { resetPassword } from "../controllers/auth/reset-password.js";
import { resendValidationLink } from "../controllers/auth/resend-validation-email.js";


async function authRoutes(fastify, options) {
    // POST
    fastify.post("/register", register);
    fastify.post("/login", login);
    fastify.post("/logout", logout);
    fastify.post("/forgot-password", forgotPassword);
    fastify.post("/reset-password", resetPassword);
    fastify.post("/resend-validation-link", resendValidationLink);

    // GET
    fastify.get("/verify", verifyAccount);
    fastify.get("/validate-reset-link", verifyResetPasswordToken);
}

export default authRoutes;
