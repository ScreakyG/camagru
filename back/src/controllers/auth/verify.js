import { findUserByResetPasswordToken, findUserByValidationToken, setVerifiedUser } from "../../models/querys.js";
import { hashToken } from "../../utils/encrypt.js";
import { BadRequestError } from "../../utils/errors.js";

export async function verifyAccount(request, reply) {
    const token = request.query.token;

    try
    {
        if (!token || typeof token !== "string")
            throw new BadRequestError("Missing token.")

        const hashedToken = hashToken(token);
        const user = await findUserByValidationToken(hashedToken);

        if (!user)
            return (reply.redirect("/verify?status=failed"));

        await setVerifiedUser(user);
        return (reply.redirect("/verify?status=success"));
    }
    catch (error)
    {
        console.error("Error when validating account : ", error);
        return (reply.redirect("/verify?status=failed"));
    }
}

export async function verifyResetPasswordToken(request, reply) {
    const token = request.query.token;

    try
    {
        if (!token || typeof token !== "string")
            throw new BadRequestError("Missing token.")

        const hashedToken = hashToken(token);
        const user = await findUserByResetPasswordToken(hashedToken);
        if (!user)
            throw new BadRequestError("No user found for this token.")

        return (reply.redirect(`/reset-password?token=${token}`));
    }
    catch (error)
    {
        console.error("Error when checking reset password link : ", error);
        return (reply.redirect("/reset-password?status=invalid"));
    }
}
