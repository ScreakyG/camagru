import { requireAuth } from "../utils/preHandlers.js";
import { userInfos } from "../controllers/user/userInfos.js";
import { modifyPassword } from "../controllers/user/modifyPassword.js";

async function userRoutes(fastify, options) {
    // POST
    fastify.post("/modify-password", { preHandler: requireAuth } , modifyPassword);

    // GET
    fastify.get("/me", { preHandler: requireAuth }, userInfos);
}



export default userRoutes
