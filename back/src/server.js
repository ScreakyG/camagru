import Fastify from "fastify"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { initDB } from "./db/db.js"

// Instance setup
const fastify = Fastify({
    logger: true
})

await initDB();

fastify.register(cookie);

// Register des routes de l'API
await fastify.register(authRoutes, {prefix: "/api/auth"});
await fastify.register(userRoutes, {prefix: "/api/user"});

// Register du plugins pour gerer CORS
// await fastify.register(cors, {
//     origin: ["http://localhost:8080"],
//     credentials: true
//     // put your options here
// })

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
