import { open } from "sqlite"
import sqlite3 from "sqlite3"

let dbInstance = null;

export function getDB() {
    if (!dbInstance)
        throw new Error("initDB must be called before getDB");
    return (dbInstance);
}

export async function initDB() {
    try
    {
        dbInstance = await open({
            // filename: process.env.DB_PATH
            filename: "./camagru.db",
            driver: sqlite3.Database
        })
        console.log("💽 Connected to database ! ✅ ");
        await createTables();
    }
    catch (error)
    {
        console.log("💽 ❌ Error with database connection : ", error);
    }
}

async function createTables() {
    // await dbInstance.exec(`
    //     CREATE TABLE IF NOT EXISTS users (
    //         id          INTEGER     PRIMARY KEY     AUTOINCREMENT,
    //         email       TEXT        UNIQUE  NOT     NULL,
    //         username    TEXT        UNIQUE  NOT     NULL,
    //         password    TEXT        NOT     NULL,
    //         createdAt   DATETIME    DEFAULT CURRENT_TIMESTAMP,
    //         isVerified  BOOLEAN     DEFAULT FALSE,

    //         verification_token_hash TEXT,


    //         reset_pw_token_hash  TEXT
    // )`);

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            username            VARCHAR(150) NOT NULL UNIQUE,
            email               VARCHAR(150) NOT NULL UNIQUE,
            password_hash       TEXT NOT NULL,
            is_verified         BOOLEAN DEFAULT FALSE NOT NULL,
            created_at          DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`);

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS tokens (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            token_hash          TEXT NOT NULL UNIQUE,
            token_expiration    DATETIME NOT NULL,
            purpose             VARCHAR(150) NOT NULL,
            user_id             INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);
}
