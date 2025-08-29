import { findUserByEmail, storeTokenDatabase } from "../../db/querys.js";
import { hashToken } from "../../utils/encrypt.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendValidationMail } from "../../utils/mailService.js";

export async function resendValidationLink(request, reply) {
    try
    {
        const { email } = request.body;
        if (!email)
            throw new Error("No email in request");

        let user = await findUserByEmail(email);
        if (!user)
            throw new Error("No user found with this email");

        if (user.isVerified)
            throw new Error("Account is already verified");


        const token = createValidationToken();
        const hashedToken = hashToken(token);

        await storeTokenDatabase(user, "verification_token_hash", hashedToken);
        await sendValidationMail(user, token);

        return (reply.send({success: true, message: "Send you new link via mail"}));
    }
    catch (error)
    {
        console.log(error);
        return (reply.send({success: false, message: error.message}));
    }
}
