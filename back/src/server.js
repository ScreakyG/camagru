import Fastify from "fastify"
import cors from "@fastify/cors"

const fastify = Fastify({
    logger: true
})

await fastify.register(cors, {
    // put your options here
})

fastify.get("/", async function handler (request, reply) {
    return (reply.code(200).send({ hello: "world" }));
})

fastify.get("/api/", async function handler (request, reply) {
    return (reply.code(200).send({ hello: "bien ouej" }));
})

try {
    await fastify.listen({port: 3000, host: "0.0.0.0"});
}
catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
