import crypto from "crypto";
import { hashToken } from "./encrypt.js";

import { findUserByAuthToken, insertTokenDatabase, deleteTokenFromDatabase } from "../models/querys.js";

export async function createAuthToken(userId) {
    const authToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = hashToken(authToken);
    await insertTokenDatabase(userId, hashedToken, 0, "auth");

    return (authToken);
}

export async function verifyAuthToken(token) {
    // try
    // {
    //     const verified = jwt.verify(token, process.env.JWT_SECRET);
    //     return (verified);
    // }
    // catch(error)
    // {
    //     console.log("JWT verification failed : ", error.message);
    //     return (null);
    // }
    if (!token)
        return (null);

    try
    {
        const tokenHash = hashToken(token);
        const user = await findUserByAuthToken(tokenHash);
        if (user)
        {
            // console.log(`User with authToken = ${token} = ${user.id}`);
            return (user);
        }
        return (null);
    }
    catch (error)
    {
        console.log("Could not verify auth token : ", error);
    }
}

export function removeAuthToken(token) {
    if (!token)
        return ;

    try
    {
        const tokenHash = hashToken(token);
        deleteTokenFromDatabase(tokenHash);
    }
    catch (error)
    {
        console.log("Could not remove auth token : ", error);
    }
}

export function createValidationToken()
{
    const verificationToken = crypto.randomBytes(32).toString("hex");
    return (verificationToken);
}
