import { findUserByResetPasswordToken, findUserByValidationToken, setVerifiedUser } from "../../db/querys.js";
import { hashToken } from "../../utils/encrypt.js";

export async function verifyAccount(request, reply) {
    const token = request.query.token;

    try
    {
        if (!token || typeof token !== "string")
            return (reply.code(400).send({success: false, message: "Missing token"}));

        // Chercher quel user a ce token dans la db.
        const hashedToken = hashToken(token);
        const user = await findUserByValidationToken(hashedToken);

        if (!user)
        {
            reply.redirect("/verify?status=failed");
            return (reply.code(400).send({success: false, message: "Invalid/expired token"}));
        }

        // Changer le status verified de l'user a true;
        await setVerifiedUser(user);
        reply.redirect("/verify?status=success");
    }
    catch (error)
    {
        // It means that its a error that we throw ourself.
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        // It is a error that we did not handle. (We should avoid this at all cost).
        else
            return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}

export async function verifyResetPasswordToken(request, reply) {
    const token = request.query.token;

    try
    {
        if (!token || typeof token !== "string")
            throw new Error("Missing token");
        
        // TODO: Verifier si le token est pas expire.
        const hashedToken = hashToken(token);
        const user = await findUserByResetPasswordToken(hashedToken);
        if (!user)
            throw new Error("No user found for this token");

        return (reply.redirect(`/reset-password?token=${token}`));
    }
    catch (error)
    {
        console.error("Error when checking reset password link : ", error);
        return (reply.redirect("/reset-password?status=invalid"));
    }
}
