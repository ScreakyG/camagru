import { userInfos } from "../controllers/user/userInfos.js";
import { modifyPassword } from "../controllers/user/modifyPassword.js";
import { modifyUserInfos } from "../controllers/user/modifyUserInfos.js";
import { publishImage } from "../controllers/user/publishImage.js";

async function userRoutes(fastify, options) {
    // POST
    fastify.post("/modify-password", modifyPassword);
    fastify.post("/modify-user-infos", modifyUserInfos);

    fastify.post("/publish-image", publishImage);

    // GET
    fastify.get("/me", userInfos);
}



export default userRoutes
