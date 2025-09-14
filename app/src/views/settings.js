import { getFormValues } from "../utils.js";

function submitProfileForm(profileForm) {
    const formValues = getFormValues(profileForm);
    console.log(formValues);
    
}

function handleSettingsForms() {
    const updateProfileForm = document.getElementById("update-profile-form");
    const updatePasswordForm = document.getElementById("update-password-form");

    updateProfileForm?.addEventListener("submit", (event) => {
        event.preventDefault()
        submitProfileForm(updateProfileForm);
    });

    updatePasswordForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Password form called");
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
                        <input type="text" name="username" class="input input-bordered text-white ml-1" placeholder=${user.username} value=${user.username}></input>
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
                        <input type="password" class="input input-bordered text-white ml-1" placeholder="*********" required></input>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Repeat new password</label>
                        <input type="password" class="input text-white ml-1" required></input>
                    </div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
        </div>
    `;

    appEl.appendChild(settingsDiv);
    handleSettingsForms();
}
