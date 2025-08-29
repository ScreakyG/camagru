import { printAPIResponse, getFormValues } from "./utils.js";
import { router } from "./router.js";
import { closeLoginModal } from "./utils.js";
import { redirectTo } from "./navigation.js";
import { showAccountVerificationModal } from "./register.js";

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
            // Handle if account is not verified
            if (response.status === 403)
            {
                closeLoginModal();
                showAccountVerificationModal(resData.email);
                return ;
            }

            const showError = document.getElementById("login-error-message");
            showError.textContent = resData.errorMessage;
        }
        else
        {
            printAPIResponse("/api/auth/login", resData);
            closeLoginModal();
            window.history.pushState({}, "", "/");
            router();
        }
    }
    catch (error)
    {
        console.error("Error while fetching API /api/auth/login");
    }
}

export function handleLoginModal() {
    const closeModalBtn = document.getElementById("close-login-modal");
    const form = document.getElementById("login-form");
    const forgotPassword = document.getElementById("forgot-password");

    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        closeLoginModal();
        redirectTo("/");
    });

    // Handle the login button that send the form.
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm();
    });

    // Clicking anchors is catched in routers function but we need to close previous modal.
    forgotPassword.addEventListener("click", closeLoginModal);
}
