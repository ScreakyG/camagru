import { printAPIResponse } from "./utils.js";

async function submitForm() {
    const formMail = "warclown"
    try
    {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({formMail})
        })
        const resData = await response.json();
        if (!response.ok)
            printAPIResponse("/api/auth/register", resData);
        else
            printAPIResponse("/api/auth/register", resData);
    }
    catch (error)
    {
        console.error("Error while fetching API");
    }
}

export function handleRegisterModal(params) {
    const dialog = document.getElementById("register-modal");
    const closeModalBtn = document.getElementById("close-register-modal");
    const submitBtn = document.getElementById("submit-register-btn");

    closeModalBtn?.addEventListener("click", () => {
        dialog?.close();
    })

    submitBtn?.addEventListener("click", () => {
        console.log("You submited register form");
        submitForm();
    })

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
        }
}
