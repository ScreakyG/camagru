import { printAPIResponse, getFormValues } from "./utils.js";

function resetInputsErrors(params) {
    const emailInput = document.getElementById("email");
    const emailErrors = document.getElementById("email-errors");
    const emailLabel = document.getElementById("email-label");

    emailInput.addEventListener("focus", () => {
        emailLabel.classList.remove("border-error");
        emailErrors.textContent = "";
    })
}

function verifyRegisterForm(formValues) {
    let errors = 0;
    const emailLabel = document.getElementById("email-label");
    const emailErrors = document.getElementById("email-errors");
    const passwordLabel = document.getElementById("password-label");
    const passwordErrors = document.getElementById("password-errors");

    if (formValues.email === "")
    {
        emailLabel.classList.add("border-error");
        emailErrors.textContent = "Enter a valid email";
        errors++;
    }

    if (formValues.password === "")
    {
        passwordLabel.classList.add("border-error");
        passwordErrors.textContent = "At least 8 characters";
        errors++;
    }

    if (errors != 0)
        return (false);
    return (true);
}

async function submitForm() {
    const registerForm = document.getElementById("register-form");
    const formValues = getFormValues(registerForm);

    if (!verifyRegisterForm(formValues))
        return ;

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

    resetInputsErrors();

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
    }
}
