import { redirectTo } from "../navigation.js";
import { printAPIResponse, closeForgotPasswordModal } from "../utils.js";

async function submitForgotPassword(form) {
    const formData = new FormData(form);
    const email = formData.get("email");

    try
    {
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        });

        const resData = await response.json();
        printAPIResponse("/api/auth/forgot-password", resData);

        closeForgotPasswordModal();
        showCheckPasswordMailModal(email);
    }
    catch (error)
    {
        console.error("Error while fetching API /api/auth/forgot-password");
        console.error(error);
    }
}

function showCheckPasswordMailModal(email) {

    const newDiv = document.createElement("div");
        newDiv.innerHTML = /*html*/
            `<dialog class="modal">
                <div class="modal-box">
                    <h2 class="text-center text-2xl">Check your email</h2>
                    <button class="btn btn-error absolute right-2 top-2" autofocus>X</button>
                    <div class="m-4 flex-col items-center">
                        <p class="m-2 text-center">
                            If an account exists for <span class="font-semibold text-indigo-300">${email}</span>,<br>
                            you’ll receive a password reset link shortly.
                        </p>
                        <p class="mt-2 text-sm text-gray-500 text-center">
                            Don’t forget to check your spam folder.
                        </p>
                    </div>
                </div>
            </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = newDiv.querySelector("dialog");
    modal.showModal();

    const closeModalBtn = newDiv.querySelector("button");
    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        modal.close();
        redirectTo("/");
    });

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })
}

export function showForgotPasswordModal() {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = /*html*/
        `<dialog id="forgot-password-modal" class="modal">
            <div class="modal-box">
                <h2 class="text-center text-2xl">Reset your password</h2>
                <button id="close-btn-forgot-modal" class="btn btn-error absolute right-2 top-2" autofocus>X</button>
                <form>
                    <div class="m-4">
                        Email
                        <label class="input validator w-full mt-2">
                            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input name="email" type="email" placeholder="Enter your email" required/>
                        </label>
                        <div class="validator-hint hidden">Enter valid email address</div>
                    </div>
                    <div class="m-4">
                        <button type="submit" class="btn btn-primary w-full">Reset Password</button>
                    </div>
                </form>
            </div>
        </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const forgotPasswordForm = newDiv.querySelector("form");
    forgotPasswordForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        submitForgotPassword(forgotPasswordForm);
    });

    const modal = newDiv.querySelector("dialog");
    modal.showModal();

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })

    const closeModalBtn = document.getElementById("close-btn-forgot-modal");
    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        modal.close();
        redirectTo("/");
    });

}
