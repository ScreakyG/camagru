import jwt from "jsonwebtoken";
import crypto from "crypto";

import { findUserByAuthToken, insertTokenDatabase } from "../models/querys.js";

export async function createAuthToken(userId) {
    const authToken = crypto.randomBytes(32).toString("hex");
    await insertTokenDatabase(userId, authToken, 0, "auth");

    return (authToken);
}

// Creer un JWT avec notre secret word et jsonData dans le payload.
export function createJWT(jsonData, options = {}) {
    const token = jwt.sign(jsonData, process.env.JWT_SECRET);
    return (token);
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
    const user = await findUserByAuthToken(token);
    console.log(`User with authToken = ${token} = ${user.id}`);
    if (user)
        return (user);

    return (null);
}

export function createValidationToken()
{
    const verificationToken = crypto.randomBytes(32).toString("hex");
    return (verificationToken);
}
