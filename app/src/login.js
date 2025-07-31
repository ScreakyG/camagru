import { printAPIResponse, getFormValues } from "./utils.js";
import { router } from "./router.js";
import { closeLoginModal } from "./utils.js";

async function submitForm() {
    const loginForm = document.getElementById("login-form");
    const formValues = getFormValues(loginForm);

    try
    {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });

        const resData = await response.json();
        if (!response.ok)
        {
            printAPIResponse("/api/auth/login", resData);

            const showError = document.getElementById("login-error-message");
            showError.textContent = resData.errorMessage;
        }
        else
        {
            printAPIResponse("/api/auth/login", resData);
            closeLoginModal();
        }
    }
    catch (error)
    {
        console.error("Error while fetching API");
    }
}

export function handleLoginModal() {
    const closeModalBtn = document.getElementById("close-login-modal");
    const form = document.getElementById("login-form");

    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        closeLoginModal();
    });

    // Handle the login button that send the form.
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm();
    });
}
