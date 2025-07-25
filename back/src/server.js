import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js"
import { initDB } from "./db/db.js"

// Instance setup
const fastify = Fastify({
    logger: true
})

await initDB();

// Register des routes liees a l'Auth
await fastify.register(authRoutes, {prefix: "/api/auth"});

// Register du plugins pour gerer CORS
// await fastify.register(cors, {
//     // put your options here
// })

// Check si l'API fonctionne bien
fastify.get("/api/health", async function handler (request, reply) {
    return (reply.code(200).send({ message: "API is working" }));
})

// Simple test endpoint to see if jwt creation works.
fastify.get("/api/jwt", (request, reply) => {
    const createTokenFromJson = (jsonData, options = {}) => {
        try
        {
            const secretKey = "test";
            const token = jwt.sign(jsonData, secretKey);
            return (token);
        }
        catch(error)
        {
            console.log("Error /api/jwt: ", error.message);
            return (null);
        }
    }

    const jsonData = { email: "yka@gmail.com", password: "mdp"};
    const token = createTokenFromJson(jsonData);

    if (token)
        return (reply.send({success: true, token: token}));
    else
        return (reply.send({success: false}));
})

try {
    await fastify.listen({port: 3000, host: "0.0.0.0"});
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
