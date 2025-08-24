import { hashToken } from "../../utils/encrypt.js";
import { findUserByResetPasswordToken } from "../../db/querys.js";

export async function resetPassword(request, reply) {
    /**
     * TODO:
     *  1/ Verifier si le MDP valide les consignes.
     *  2/ Verifier si le token est valide / expiration.
     *  3/ Update le MDP dans la DB.
     */
    const token = request.body.token;
    try
    {
        if (!token || typeof token !== "string")
            throw new Error("Missing token");


        const hashedToken = hashToken(token);
        const user = await findUserByResetPasswordToken(hashedToken);

        if (!user)
            throw new Error("Invalid / Expired token");

        return reply.send({message: "Password successfuly changed for user = ", user});
    }
    catch (error)
    {
        return (reply.code(500).send({success: false, message: error.message}));
    }
}
