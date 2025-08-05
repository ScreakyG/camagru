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

export function showAccountVerificationModal(email) {
    const newDiv = document.createElement("div");

    newDiv.innerHTML = /*html*/
        `<dialog id="success-register" class="modal">
            <div class="modal-box">
                <h2 class="text-center text-2xl font-bold">Verify your account</h2>
                <div class="m-4 flex flex-col items-center">
                    <p class="m-2 text-center">You're almost there! We sent an email to <br/>
                        <span class="text-indigo-300 font-semibold">${email}</span>
                    </p>
                    <p class="m-2">Just click on the link in that email to complete your signup. If you don't see it, you may need to check your spam folder.</p>
                    <p class="m-2">Still can't find the email ? No problem.</p>
                    <button type="button" class="btn btn-primary mt-4">Resend Verification Email</button>
                </div>
            </div>
        </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = document.getElementById("success-register");
    modal.showModal();
}
