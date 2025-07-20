import { printAPIResponse, getFormValues } from "./utils.js";

async function submitForm() {
    const registerForm = document.getElementById("register-form");
    const formValues = getFormValues(registerForm);

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

function repeatPasswordMatch() {
    const passwordInput = document.getElementById("password");
    const reapeatPassword = document.getElementById("repeat-password-input");
    const reapeatPasswordLabel = document.getElementById("repeat-password-label");

    if (reapeatPassword.value !== passwordInput.value)
    {
        reapeatPasswordLabel.classList.add("border-error");
        return (false);
    }
    reapeatPasswordLabel.classList.add("border-success");
    return (true);
}

export function handleRegisterModal() {
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
        if (!repeatPasswordMatch())
            return ;
        submitForm();
    });

    // Handle password repeat validation.
    const reapeatPassword = document.getElementById("repeat-password-input");
    
    reapeatPassword.addEventListener("focus", () => {
        const reapeatPasswordLabel = document.getElementById("repeat-password-label");
        reapeatPasswordLabel.classList.remove("border-error");
        reapeatPasswordLabel.classList.remove("border-success");
    })

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
    }
}
