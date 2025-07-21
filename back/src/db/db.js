import { open } from "sqlite"
import sqlite3 from "sqlite3"

let dbInstance = null;

export async function initDB() {
    dbInstance = await open({
        filename: "./database.sqlite",
        driver: sqlite3.Database
    })

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER     PRIMARY KEY     AUTOINCREMENT,
            username    TEXT        NOT     NULL,
            createdAt   DATETIME    NOT     NULL    DEFAULT CURRENT_TIMESTAMP
    )`)
}

export function getDB() {
    if (!dbInstance)
        throw new Error("initDB must be called before getDB");
    return (dbInstance);
}
