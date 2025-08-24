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

    if (!token || typeof token !== "string")
        return reply.send({success: false, message: "Missing token"});

    const hashedToken = hashToken(token);
    const user = await findUserByResetPasswordToken(hashedToken);

    if (!user)
        return reply.send({success: false, message: "Invalid / Expired token"});
    return reply.send({message: "Your token is valid for user = ", user});
}
