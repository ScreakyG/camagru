export function handleLoginModal(params) {
    const dialog = document.getElementById("login-modal");
    const closeModalBtn = document.getElementById("close-login-modal");

    closeModalBtn?.addEventListener("click", () => {
        dialog?.close();
    })
}
