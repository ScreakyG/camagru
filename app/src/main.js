import { router, handleAnchors } from "./router.js";
import { handleHeader } from "./header.js";
import { handleRegisterModal } from "./register.js";
import { handleLoginModal } from "./login.js";
import { handleForwardAndBackward } from "./navigation.js";

//Permet de override la fonction pour quelle ne fasse rien.
// console.log = () => {};

document.addEventListener("DOMContentLoaded", () => {
    handleRegisterModal();
    handleLoginModal();
    handleHeader();
    handleAnchors();
    handleForwardAndBackward();
    router();
})
