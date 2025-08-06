import { redirectTo } from "../../navigation.js";

export function showVerifiedAccountSuccess() {
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
