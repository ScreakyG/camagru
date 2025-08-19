import { redirectTo } from "../../navigation.js";

function showSuccess() {
    const newDiv = document.createElement("div");

    newDiv.innerHTML = /*html*/
        `<dialog id="acc-validation-success-modal" class="modal">
            <div class="modal-box">
                <h2 class="text-center text-2xl font-bold">Verification successful</h2>
                <div class="m-4 flex flex-col items-center">
                    <p class="m-2 text-center">Your account is now verified, you may now proceed to log in</p>
                    <button type="button" class="btn btn-primary mt-4">Login</button>
                </div>
            </div>
        </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = document.getElementById("acc-validation-success-modal");
    modal.showModal();

    const loginBtn = modal.querySelector("button");
    loginBtn?.addEventListener("click", () => {
        modal.close();
        redirectTo("/login");
    })

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })
}

function showFailed() {
    const newDiv = document.createElement("div");

    newDiv.innerHTML = /*html*/
        `<dialog id="acc-validation-failed-modal" class="modal">
            <div class="modal-box">
                <h2 class="text-center text-2xl font-bold">Verification failed</h2>
            </div>
        </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = document.getElementById("acc-validation-failed-modal");
    modal.showModal();

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })
}

export function showVerifyStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    console.log(status);


    switch (status) {
        case "success":
            showSuccess();
            break;

        case "failed":
            showFailed();
            break;

        default:
            break;
    }
}
