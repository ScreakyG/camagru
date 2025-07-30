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
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");

    registerBtn?.addEventListener("click", () => {
        resetRegisterForm();
        registerModal?.showModal();
    })

    loginBtn?.addEventListener("click", () => {
        resetLoginForm();
        loginModal?.showModal();
    })

    //Handle modals closing when clicking outside the modal.
    window.onclick = function (event) {
        if (event.target === loginModal)
           loginModal?.close();
        else if (event.target === registerModal)
           registerModal?.close();
    }
}
