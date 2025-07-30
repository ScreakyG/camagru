export function handleHeader() {
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");
    const loginModal = document.getElementById("login-modal");
    const registerModal = document.getElementById("register-modal");

    registerBtn?.addEventListener("click", () => {
        registerModal?.showModal();
    })

    loginBtn?.addEventListener("click", () => {
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
