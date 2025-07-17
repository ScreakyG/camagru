import Fastify from "fastify"
import cors from "@fastify/cors"

import authRoutes from "./routes/authRoutes.js"

// Instance setup
const fastify = Fastify({
    logger: true
})

// Register des routes liees a l'Auth
await fastify.register(authRoutes, {prefix: "/api/auth"});
// Register du plugins pour gerer CORS
await fastify.register(cors, {
    // put your options here
})

// Check si l'API fonctionne bien
fastify.get("/api/health", async function handler (request, reply) {
    return (reply.code(200).send({ message: "API is working" }));
})

try {
    await fastify.listen({port: 3000, host: "0.0.0.0"});
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
