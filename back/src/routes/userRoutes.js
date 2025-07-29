import { requireAuth } from "../utils/preHandlers.js";

async function userRoutes(fastify, options) {
    fastify.get("/me", { preHandler: requireAuth },  async (request, reply) => {
        return (reply.send({ success: true, user: request.user }));
    });
}

export default userRoutes
