import Fastify from "fastify"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"


import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { initDB } from "./services/db.js"
import { initEmailService, emailServiceStatus } from "./services/mailService.js"

const FILESIZE_LIMIT = process.env.MAX_IMG_SIZE || 2;

// Instance setup
const fastify = Fastify({
    logger: true
})

// Start les services necessaires pour l'API ( les try/catch sont des les fonctions donc l'app ne va pas crash atm).
await initDB();
initEmailService();
await emailServiceStatus();

await fastify.register(cookie);
await fastify.register(import('@fastify/multipart'), {
    limits: {
        parts: 2,
        fileSize: FILESIZE_LIMIT * 1024 * 1024 //Limite de la taille des fichiers (en octets).
    }
});


// Register du plugin pour gerer CORS
// await fastify.register(cors, {
//     origin: ["http://localhost:8080"],
//     credentials: true
//     // put your options here
// })

// Register des routes de l'API
await fastify.register(authRoutes, {prefix: "/api/auth"});
await fastify.register(userRoutes, {prefix: "/api/user"});

// Check si l'API fonctionne bien
fastify.get("/api/health", async function handler (request, reply) {
    return (reply.code(200).send({ message: "API is working" }));
})

try
{
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({port, host});
    console.log(`✅ Server running on ${host}:${port}`);
}
catch (err)
{
    fastify.log.error(err);
    process.exit(1);
}
