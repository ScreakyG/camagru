import { router } from "./router.js";
import { handleHeader } from "./header.js";
import { handleRegisterModal } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
    handleRegisterModal();
    handleHeader();
    // router();
})
