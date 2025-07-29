import bcrypt from "bcrypt";

export async function encryptPassword(password) {
    const passHash = await bcrypt.hash(password, 10);

    return (passHash);
}

export async function decryptPassword(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);

    return (result);
}
