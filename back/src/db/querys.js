import { getDB } from "./db.js";

export async function createUser(email, username, password) {

    const userExists = await findUserByEmail(email);
    if (userExists)
        throw new Error("❌ This email is already taken");


    const db = getDB();
    const query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    const result = await db.run(query, [email, username, password]);
}

export async function findUserByEmail(email) {
    const db = getDB();
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await db.get(query, [email]);

    return (result);
}
