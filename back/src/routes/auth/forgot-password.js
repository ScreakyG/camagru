import { findUserByEmail, insertTokenDatabase } from "../../db/querys.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendPasswordResetMail } from "../../utils/mailService.js";
import { hashToken } from "../../utils/encrypt.js";
import { setExpirationDate } from "../../utils/time.js";
import { BadRequestError } from "../../utils/errors.js";

export async function forgotPassword(request, reply) {
    /**
     * TODO:
     *  Envoyer une reponse positive dans tout les cas ?
     *  les users ne devrait pas savoir si une requete a reussi ou pas a des fins de securite.
     */
    try
    {
        let { email } = request.body;

        if (!email)
            throw new BadRequestError("Missing email in body.");

        const user = await findUserByEmail(email);
        if (user && user.is_verified)
        {
            const token = createValidationToken();
            const hash = hashToken(token);

            await insertTokenDatabase(user.id, hash, setExpirationDate(15), "reset_password");
            await sendPasswordResetMail(user, token);
        }
        return reply.send({success: true, message: "If an account exist check your emails."});
    }
    catch (error)
    {
        if (error.statusCode)
            return reply.code(error.statusCode).send({success: false, message: error.message});
        else
            return reply.code(500).send({success: false, message: error.message});
    }
}
