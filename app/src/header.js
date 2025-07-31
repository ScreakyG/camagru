import { closeLoginModal, closeRegisterModal, showLoginModal, showRegisterModal } from "./utils.js";

function resetLoginForm() {
    const errorMsg = document.getElementById("login-error-message");
    errorMsg.textContent = "";

    const loginForm = document.getElementById("login-form");
    loginForm.reset();
}

function resetRegisterForm() {
    const errorMsg = document.getElementById("register-error-message");
    errorMsg.textContent = "";

    // Clean le repeat password (pas gere dans form.reset)
    const reapeatPasswordLabel = document.getElementById("repeat-password-label");
    reapeatPasswordLabel.classList.remove("border-error");
    reapeatPasswordLabel.classList.remove("border-success");

    const loginForm = document.getElementById("register-form");
    loginForm.reset();
}


export function handleHeader() {
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    registerBtn?.addEventListener("click", () => {
        resetRegisterForm();
        showRegisterModal();
    })

    loginBtn?.addEventListener("click", () => {
        resetLoginForm();
        showLoginModal();
    })

    //Handle modals closing when clicking outside the modal.
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");
    
    window.onclick = function (event) {
        if (event.target === loginModal)
           closeLoginModal();
        else if (event.target === registerModal)
           closeRegisterModal();
    }
}
