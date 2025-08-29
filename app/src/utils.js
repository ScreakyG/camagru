import { redirectTo } from "./navigation.js";

export function closeResetModal(modal, toReset) {
    if (!modal)
        return ;

    modal.close();
    const currUrl = new URL(location.href);
    currUrl.searchParams.delete(toReset);

    const newParams = currUrl.search ? `?${currUrl.searchParams}` : "";
    redirectTo(currUrl.pathname + newParams);
}

// Afficher la reponse d'un call API.
export function printAPIResponse(routeAPI, response) {
    console.log("Response from " + routeAPI + " : ", response);
}

// Recuperer les valeurs du formulaires de register.
export function getFormValues(form) {
    if (!form)
    {
        console.warn("Could not getFormValues because form is undefined/null");
        return (null);
    }

    let formData = new FormData(form);
    const formValues = Object.fromEntries(formData);

    return (formValues);
}

export function closeLoginModal() {
    const loginModal = document.getElementById("login-modal");
    loginModal?.close();
}

export function closeRegisterModal() {
    const registerModal = document.getElementById("register-modal");
    registerModal?.close();
}

export function showLoginModal() {
    const loginModal = document.getElementById("login-modal");
    loginModal?.showModal();
}

export function showRegisterModal() {
    const registerModal = document.getElementById("register-modal");
    registerModal?.showModal();
}

export function closeForgotPasswordModal() {
    const forgotPasswordModal = document.getElementById("forgot-password-modal");
    forgotPasswordModal?.close();
}

