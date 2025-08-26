import { printAPIResponse, getFormValues } from "../utils.js";
import { redirectTo } from "../navigation.js";

async function submitForm(modal, form) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const password = getFormValues(form).password;

    try
    {
         const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token, password})
         });
         const resData = await response.json();
         printAPIResponse("/api/auth/reset-password", resData);

        modal.close();
        if (!response.ok)
        {
            redirectTo("/reset-password?status=invalid");
            return;
        }
        redirectTo("/reset-password?status=success");
    }
    catch (error)
    {
        console.error("Error while fetching /api/auth/reset-password");
        console.error(error);
    }
}

function showSuccess(modal) {
    modal.innerHTML = /*html*/`
        <div class="modal-box">
            <h2 class="text-center text-2xl">Password changed</h2>
            <div class="m-4 flex-col items-center">
                <p class="m-2 text-center">Your password has been successfully changed.</p>
                <button class="m-2 btn btn-primary w-full">Log in</button>
            </div>
        </div>
    `

    const loginBtn = modal.querySelector("button");
    loginBtn.addEventListener("click", () => {
        modal.close();
        redirectTo("/login");
    });
}

function showFailure(modal) {
    modal.innerHTML = /*html*/`
        <div class="modal-box">
            <h2 class="text-center text-2xl">Invalid / Expired Token</h2>
            <button class="btn btn-error absolute right-2 top-2" autofocus>X</button>
            <div class="m-4 flex-col items-center">
                <p class="m-2 text-center">
                    We couldn’t reset your password because this link is invalid or has expired.<br>
                    For security, reset links are single-use and valid for a limited time.
                </p>
                <a href="/forgot-password" class="btn btn-primary mt-2 w-full">Request a new reset link</a>
            </div>
        </div>
    `
    const requestNewLink = modal.querySelector("a");
    requestNewLink.addEventListener("click", () => modal.close());
}

function showResetForm(modal) {
    modal.innerHTML = /*html*/
        `<div class="modal-box">
            <form name="reset-password-form">
                <h2 class="text-center text-2xl">Reset password</h2>
                <button class="btn btn-error absolute right-2 top-2" autofocus>X</button>
                <div class="m-4">
                    New password
                    <label class="input validator w-full mt-2">
                        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke-width="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                ></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                            </g>
                        </svg>
                        <input name="password" type="password" placeholder="Password" required pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}" minlength="8"/>
                    </label>
                    <div class="validator-hint hidden">
                        Must be more than 8 characters, including<br />
                        At least one number <br />
                        At least one lowercase letter <br />
                        At least one uppercase letter <br />
                        At least one special character !@#$%^&*
                    </div>
                </div>
                <div class="m-4">
                    <button type="submit" class="btn btn-primary w-full">Change Password</button>
                </div>
            </form>
        </div>`

    const form = modal.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForm(modal, form);
    })

    const redCross = modal.querySelector("button");
    redCross?.addEventListener("click", () => {
        modal.close();
        redirectTo("/");
    })
}

export async function showPasswordResetModal() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");


    const newDiv = document.createElement("div");
    newDiv.innerHTML = /*html*/
    `<dialog class="modal">
    </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = newDiv.querySelector("dialog");
    switch (status) {
        case "invalid":
            showFailure(modal);
            break;

        case "success":
            showSuccess(modal);
            break;

        default:
            showResetForm(modal);
            break;
    }
    modal.showModal();

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })
}
