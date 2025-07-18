import { printAPIResponse } from "./utils.js";

// Recuperer les valeurs du formulaires de register.
function getFormValues() {
    const registerForm = document.getElementById("register-form");

    if (!registerForm)
        return;

    let formData = new FormData(registerForm);
    const formValues = {
        email: formData.get("email"),
        password: formData.get("password")
    };

    return (formValues);
}

async function submitForm() {
    const formValues = getFormValues();

    try
    {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });

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
    const form = document.getElementById("register-form");

    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        dialog?.close();
    })

    // Handle the register button that send the form.
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm();
    });

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
    }
}
