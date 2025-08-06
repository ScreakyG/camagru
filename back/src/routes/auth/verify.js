import { findUserByValidationToken, setVerifiedUser } from "../../db/querys.js";

export async function verifyAccount(request, reply) {
    const token = request.query.token;

    try
    {
        if (!token)
            return (reply.code(400).send({success: false, message: "Missing token"}));

        // Chercher quel user a ce token dans la db.
        const user = await findUserByValidationToken(token);

        if (!user)
            return (reply.code(400).send({success: false, message: "Invalid/expired token"}));

        // Changer le status verified de l'user a true;
        await setVerifiedUser(user);

        reply.redirect("/verified");
        return (reply.send({success: true, message: "Your account has been verified"}));
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
