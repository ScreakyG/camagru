export function showPasswordResetModal() {
    const newDiv = document.createElement("div");
        newDiv.innerHTML = /*html*/
            `<dialog class="modal">
                <div class="modal-box">
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
                </div>
            </dialog>`

    const body = document.querySelector("body");
    body.appendChild(newDiv);

    const modal = newDiv.querySelector("dialog");
    modal.showModal();

    // Peut etre changer car il y a egalement un button submit ce qui pourrait poser un probleme.
    const closeModalBtn = newDiv.querySelector("button");
    // Handle closing modal with redcross.
    closeModalBtn?.addEventListener("click", () => {
        modal.close();
    });

    // Supprime la <div> au dessus pour destroy la modal
    modal.addEventListener("close", () => {
        modal.parentElement.remove();
    })
}
