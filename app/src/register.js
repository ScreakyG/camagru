import { printAPIResponse, getFormValues, closeRegisterModal, showLoginModal } from "./utils.js";

export function showSuccessfulRegister(email) {
    closeRegisterModal();

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
        {
            printAPIResponse("/api/auth/register", resData);
            const showError = document.getElementById("register-error-message");
            showError.textContent = resData.errorMessage;
        }
        else
        {
            printAPIResponse("/api/auth/register", resData);
            showSuccessfulRegister(resData.user.email);
        }
    }
    catch (error)
    {
        console.error("Error while fetching API /api/auth/register");
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
    const closeModalBtn = document.getElementById("close-register-modal");
    const form = document.getElementById("register-form");

    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        closeRegisterModal();
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
}
