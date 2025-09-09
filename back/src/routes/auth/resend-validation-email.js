import { findUserByEmail, insertTokenDatabase } from "../../db/querys.js";
import { hashToken } from "../../utils/encrypt.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendValidationMail } from "../../utils/mailService.js";
import { setExpirationDate } from "../../utils/time.js";

export async function resendValidationLink(request, reply) {
    try
    {
        const { email } = request.body;
        if (!email)
            throw new Error("No email in request body");

        let user = await findUserByEmail(email);
        if (!user)
            throw new Error("No user found with this email");

        if (user.is_verified)
            throw new Error("Account is already verified");


        const token = createValidationToken();
        const hashedToken = hashToken(token);

        await insertTokenDatabase(user.id, hashedToken, setExpirationDate(60), "validation");
        await sendValidationMail(user, token);

        return (reply.send({success: true, message: "Send you new link via mail"}));
    }
    catch (error)
    {
        console.log(error);
        return (reply.send({success: false, message: error.message}));
    }
}
