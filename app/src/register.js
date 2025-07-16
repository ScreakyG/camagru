export function handleRegisterModal(params) {
    const dialog = document.getElementById("register-modal");
    const closeModalBtn = document.getElementById("close-register-modal");
    const submitBtn = document.getElementById("submit-register-btn");

    closeModalBtn?.addEventListener("click", () => {
        dialog?.close();
    })

    submitBtn?.addEventListener("click", () => {
        console.log("You submited register form");
    })

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
        }
}
