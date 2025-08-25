import { hashToken } from "../../utils/encrypt.js";
import { findUserByResetPasswordToken } from "../../db/querys.js";
import { verifyPasswordInput } from "../../utils/validation.js";
import { updatePassword } from "../../db/querys.js";

export async function resetPassword(request, reply) {
    /**
     * TODO:
     *  1/ Verifier si le token est valide / expiration.
     *  Envoyer un mail pour dire que le MDP a change ?
     */
    const { token, password } = request.body;
    try
    {
        if (!token || typeof token !== "string")
            throw new Error("Missing token");


        const hashedToken = hashToken(token);
        const user = await findUserByResetPasswordToken(hashedToken);

        if (!user)
            throw new Error("Invalid / Expired token");

        const newPassword = verifyPasswordInput(password)
        await updatePassword(user, newPassword);

        return reply.code(200).send({message: "Password successfuly changed for user = ", user});
    }
    catch (error)
    {
        // It means that its a error that we throw ourself.
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        // It is a error that we did not handle. (We should avoid this at all cost).
        return (reply.code(500).send({success: false, errorMessage: error.message}));
    }
}
