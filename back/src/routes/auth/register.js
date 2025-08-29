import { createUser } from "../../db/querys.js";
import { verifyEmailInput, verifyPasswordInput, verifyUsernameInput } from "../../utils/validation.js";
import { sendValidationMail } from "../../utils/mailService.js";

export async function register(request, reply)
{
    try
    {
        console.log("Request body : ", request.body);
        let { username, email, password } = request.body;

        // Verifie le format et rejette en cas de caracteres innatendus.
        username = verifyUsernameInput(username);
        email = verifyEmailInput(email);
        password = verifyPasswordInput(password);

        // Creer un user , crypte le mdp et store dans la DB.
        const newUser = await createUser(email, username, password);
        await sendValidationMail(newUser, newUser.verificationToken);

        return (reply.code(201).send({ success: true, message:"Succesfully registered", user: newUser }));
    }

    catch(error)
    {
        // It means that its a error that we throw ourself.
        if (error.statusCode)
            return (reply.code(error.statusCode).send({success: false, errorMessage: error.message}));
        // It is a error that we did not handle. (We should avoid this at all cost).
        else
            return (reply.code(500).send({success: false, errorMessage: "Internal server error", details: error.message}));
    }
}
