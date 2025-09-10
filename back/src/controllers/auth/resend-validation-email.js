import { findUserByEmail, insertTokenDatabase } from "../../models/querys.js";
import { hashToken } from "../../utils/encrypt.js";
import { BadRequestError } from "../../utils/errors.js";
import { createValidationToken } from "../../utils/jwt.js";
import { sendValidationMail } from "../../services/mailService.js";
import { setExpirationDate } from "../../utils/time.js";
import { verifyEmailInput } from "../../utils/validation.js";

export async function resendValidationLink(request, reply) {
    try
    {
        if (!request.body)
            throw new BadRequestError("Missing body content in request.");

        let { email } = request.body;
        email = verifyEmailInput(email);

        let user = await findUserByEmail(email);
        if (!user)
            console.error("No user for this email.")

        if (user && user.is_verified)
            console.error("Account is already verified.");

        if (user && !user.is_verified)
        {
            const token = createValidationToken();
            const hashedToken = hashToken(token);

            await insertTokenDatabase(user.id, hashedToken, setExpirationDate(60), "validation");
            await sendValidationMail(user, token);
        }
        return (reply.send({success: true, message: "Send you new link via mail."}));
    }
    catch (error)
    {
        console.log(error);
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, message: error.message}))
        else
            return (reply.code(500).send({success: false, message: error.message}));
    }
}
