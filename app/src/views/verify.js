import { redirectTo } from "../navigation.js";

// Fonctions qui changent le contenu de la modal.
function showSuccess(modal) {
    modal.innerHTML = /*html*/
        `<div class="modal-box">
            <h2 class="text-center text-2xl font-bold">Verification successful</h2>
            <button class="btn btn-error absolute right-2 top-2" autofocus>X</button>
            <div class="m-4 flex flex-col items-center">
                <p class="m-2 text-center">Your account is now verified, you may now proceed to log in</p>
                <a href="/login" class="btn btn-primary w-full">Log in</a>
            </div>
        </div>`
}

function showFailed(modal) {
    modal.innerHTML = /*html*/
        `<div class="modal-box">
            <h2 class="text-center text-2xl font-bold">Verification failed</h2>
            <button class="btn btn-error absolute right-2 top-2" autofocus>X</button>
            <div class="m-4 flex-col items-center">
                <p class="m-2 text-center">
                    We couldn’t validate your account because this link is invalid or has expired.<br>
                    For security, validation links are single-use and valid for a limited time.
                </p>
                <a href="/login" class="btn btn-primary w-full">Log in</a>
            </div>
        </div>`
}

export function showVerifyStatus() {
    // On recuperer les query parameters de la requete.
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    const newDiv = document.createElement("div");
    newDiv.innerHTML = /*html*/
        `<dialog id="verification-modal" class="modal">
        </dialog>`

    const modal = newDiv.querySelector("dialog");

    switch (status) {
        case "success":
            showSuccess(modal);
            break;

        case "failed":
            showFailed(modal);
            break;

        default:
            showFailed(modal);
            break;
    }

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    modal.showModal();

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })

    const redCross = modal.querySelector("button");
    redCross?.addEventListener("click", () => redirectTo("/"));
}
