import bcrypt from "bcrypt";
import crypto from "crypto";



export async function encryptPassword(password) {
    const passHash = await bcrypt.hash(password, 10);

    return (passHash);
}

export async function decryptPassword(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);

    return (result);
}

export function hashToken(token) {
    /**
     * createHash = utilise algo sha256
     * update = ajoute des elements a hasher
     * digest = performe le hashage
     */
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    return (hash);
}
