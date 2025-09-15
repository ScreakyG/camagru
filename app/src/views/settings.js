import { getFormValues, printAPIResponse } from "../utils.js";

async function submitPasswordForm(profileForm) {
    const formValues = getFormValues(profileForm);
    console.log(formValues);

    try
    {
        const response = await fetch("/api/user/modify-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });
        const resData = await response.json();
        if (!response.ok)
        {
            printAPIResponse("/api/user/modify-password", resData);
            return;
        }
        printAPIResponse("/api/user/modify-password", resData);
        return;
    }
    catch (error)
    {
        console.error("Error while fetching API /api/user/modify-password");
    }
}

function repeatPasswordMatch(updatePasswordForm) {
    const form = getFormValues(updatePasswordForm);

    if (form.newPassword !== form.repeatPassword)
        return (false);
    return (true);
}

function handleSettingsForms() {
    const updateProfileForm = document.getElementById("update-profile-form");
    const updatePasswordForm = document.getElementById("update-password-form");

    const repeatPasswordInput = document.querySelector("input[name=repeatPassword]");
    repeatPasswordInput?.addEventListener("focus", () => {
        repeatPasswordInput.classList.remove("border-error");
        repeatPasswordInput.classList.remove("border-success");
    })

    updateProfileForm?.addEventListener("submit", async (event) => {
        event.preventDefault()
        // Verifier les inputs pour le front;
    });

    updatePasswordForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!repeatPasswordMatch(updatePasswordForm))
        {
            repeatPasswordInput.classList.add("border-error");
            return;
        }
        submitPasswordForm(updatePasswordForm);
    });
}

export function showSettingsView(currentUser) {
    let user = {
        username: currentUser.user.username,
        email: currentUser.user.email
    };

    const appEl = document.getElementById('app');
    const settingsDiv = document.createElement("div");

    settingsDiv.innerHTML = /*html*/
    ` <div class="bg-zinc-200 min-h-dvh flex flex-col text-black px-4 py-8 gap-5">
            <h1 class="text-2xl text-center">Settings</h1>
            <div class="flex flex-col border border-zinc-400 p-6 rounded-xl gap-5 w-full mx-auto sm:max-w-5xl">
                <div>
                    <h2 class="text-xl">Profile informations</h2>
                    <p class="text-gray-600">Modify your  username and email</p>
                </div>
                <form id="update-profile-form" name="update-profile-form">
                    <div class="flex flex-col">
                        <label class="mb-1">Username</label>
                        <input type="text" name="username" class="input input-bordered text-white ml-1"placeholder=${user.username} value=${user.username}></input>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Email address</label>
                        <input type="email" name="email" class="input text-white ml-1" placeholder=${user.email} value=${user.email}></input>
                    </div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
            <div class="flex flex-col border border-zinc-400 p-6 rounded-xl gap-5 w-full mx-auto sm:max-w-5xl">
                <div>
                    <h2 class="text-xl">Change password</h2>
                    <p class="text-gray-600">Set a new password</p>
                </div>
                <form id="update-password-form" name="update-password-form">
                    <div class="flex flex-col">
                        <label class="mb-1">New password</label>
                        <input type="password" name="newPassword" class="validator input input-bordered text-white ml-1" required required pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,128}" minlength="8"></input>
                        <div class="validator-hint hidden ml-1">
                            Must be between 8 and 128 characters, including<br />
                            At least one number <br />
                            At least one lowercase letter <br />
                            At least one uppercase letter <br />
                            At least one special character !@#$%^&*
                        </div>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Repeat new password</label>
                        <input type="password" name="repeatPassword" class="input text-white ml-1" required></input>
                    </div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
        </div>
    `;

    appEl.appendChild(settingsDiv);
    handleSettingsForms();
}
