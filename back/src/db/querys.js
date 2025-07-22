import { getDB } from "./db.js";

export async function createUser(username) {
    const db = getDB();
    const query = "INSERT INTO users (username) VALUES (?)";
    const result = await db.run(query, [username]);
}

export async function findUserByEmail(email) {
    const db = getDB();
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await db.get(query, [email]);
}
