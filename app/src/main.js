import { router } from "./router.js";
import { handleHeader } from "./header.js";
import { handleRegisterModal } from "./register.js";
import { handleLoginModal } from "./login.js";

document.addEventListener("DOMContentLoaded", () => {
    handleRegisterModal();
    handleLoginModal();
    handleHeader();
    router();
})
