import crypto from "crypto";
import { hashToken } from "./encrypt.js";

import { findUserByAuthToken, insertTokenDatabase } from "../models/querys.js";

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
    const tokenHash = hashToken(token);
    const user = await findUserByAuthToken(tokenHash);
    // console.log(`User with authToken = ${token} = ${user.id}`);
    if (user)
        return (user);

    return (null);
}

export function createValidationToken()
{
    const verificationToken = crypto.randomBytes(32).toString("hex");
    return (verificationToken);
}
