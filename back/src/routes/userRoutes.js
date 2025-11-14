import { userInfos } from "../controllers/user/userInfos.js";
import { modifyPassword } from "../controllers/user/modifyPassword.js";
import { modifyUserInfos } from "../controllers/user/modifyUserInfos.js";
import { publishImage } from "../controllers/user/publishImage.js";
import { getUserImages, getGalleryPosts } from "../controllers/user/gallery.js";
import { deleteImage } from "../controllers/user/delete-image.js";
import { likeImage } from "../controllers/user/likeImage.js";
import { commentImage } from "../controllers/user/commentImage.js";

async function userRoutes(fastify, options) {
    // POST
    fastify.post("/modify-password", modifyPassword);
    fastify.post("/modify-user-infos", modifyUserInfos);

    fastify.post("/publish-image", publishImage);
    fastify.post("/like/:image_id", likeImage);
    fastify.post("/post-comment/:image_id", commentImage);

    // GET
    fastify.get("/me", userInfos);
    fastify.get("/user-gallery", getUserImages);
    fastify.get("/gallery-posts", getGalleryPosts);

    // DELETE
    fastify.delete("/delete-image/:id", deleteImage);
}



export default userRoutes
