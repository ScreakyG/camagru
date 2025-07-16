export function handleHeader() {
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    registerBtn?.addEventListener("click", () => {
        console.log("You clicked register button");
        const registerModal = document.getElementById("register-modal");
        registerModal.showModal();
    })

    loginBtn?.addEventListener("click", () => {
        console.log("You clicked login button");
    })
}
