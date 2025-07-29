import { requireAuth } from "../utils/preHandlers.js";
import { userInfos } from "./user/userInfos.js";

async function userRoutes(fastify, options) {
    fastify.get("/me", { preHandler: requireAuth }, userInfos);
}

export default userRoutes
