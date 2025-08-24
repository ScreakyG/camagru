import { findUserByEmail, storeTokenDatabase } from "../../db/querys.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendPasswordResetMail } from "../../utils/mailService.js";
import { hashToken } from "../../utils/encrypt.js";

export async function forgotPassword(request, reply) {
    /**
     * TODO:
     *  1/ Recheck si le body a un email ?
     *  2/ Chercher si un utilisateur a ce mail.
     *      a/ Si non -> ne rien faire.
     *      b/ Si oui -> generer un token et envoyer un lien vers reset password page.
     *  3/ Envoyer une reponse positive dans tout les cas ? Les users ne devrait pas savoir si une requete a reussi ou pas a des fins de securite.
     */
    try
    {
        let { email } = request.body;

        if (!email)
            throw new Error("No email in body");

        const user = await findUserByEmail(email);
        if (!user || !user.isVerified)
            throw new Error("No account with this email / not verified");

        const token = createValidationToken();
        const hash = hashToken(token);

        await storeTokenDatabase(user, "reset_pw_token", hash);
        await sendPasswordResetMail(user, token);

        return reply.send({success: true, message: "Reset password mail sent"});
    }
    catch (error)
    {
        // Je devrais egalement renvoyer un message positif pour ne pas dire si cela a reussi.
        return reply.send({success: false, message: error.message});
    }
}
