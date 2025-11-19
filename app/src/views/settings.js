import { getFormValues, printAPIResponse } from "../utils.js";

function showError(field, errorMsg) {
    if (field.inputElement)
        field.inputElement.classList.add("border-error");
    showErrorDiv(field.errorDivElement, errorMsg);
}

function hideError(field) {
    if (field.inputElement)
        field.inputElement.classList.remove("border-error");
    hideErrorDiv(field.errorDivElement);
}

function showErrorDiv(errorElement, errorMsg) {
    console.log(errorElement);
    if (!errorElement)
        return ;

    errorElement.textContent = errorMsg;
    errorElement.classList.remove("hidden");
}

function hideErrorDiv(errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
}

async function submitProfileForm(profileForm) {
    const formValues = getFormValues(profileForm);
    console.log(formValues);

    try
    {
        const response = await fetch("/api/user/modify-user-infos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formValues)
        });
        const resData = await response.json();

        if (!response.ok)
        {
            printAPIResponse("/api/user/modify-user-infos", resData);
            // Si j'ai une erreur de conflit j'affiche quel champ pose probleme et pourquoi.
            if (response.status === 409)
            {
                resData.conflict_errors.forEach(element => {
                    if (element.field === "username")
                    {
                        const newUsernameError = document.getElementById("new-username-error-div");
                        const newUsernameInput = profileForm.querySelector("input[name=username]");
                        showError({inputElement: newUsernameInput, errorDivElement: newUsernameError}, element.message);
                    }
                    else if (element.field === "email")
                    {
                        const newEmailError = document.getElementById("new-email-error-div");
                        const newEmailInput = profileForm.querySelector("input[name=email]");
                        showError({inputElement: newEmailInput, errorDivElement: newEmailError}, element.message);
                    }
                });
            }
            return;
        }
        printAPIResponse("/api/user/modify-user-infos", resData);
    }
    catch (error)
    {
        console.error("Error while fetching API /api/user/modify-user-infos : ", error);
    }
}

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
            const errorMsgEl = document.getElementById("new-pw-error-div");
            showError(errorMsgEl, resData.errorMsg);
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

function handleChangePasswordForm() {
    const updatePasswordForm = document.getElementById("update-password-form");
    const repeatPasswordInput = document.querySelector("input[name=repeatPassword]");

    repeatPasswordInput?.addEventListener("focus", () => {
        repeatPasswordInput.classList.remove("border-success");
        hideError({inputElement: repeatPasswordInput, errorDivElement: repeatPasswordError});
    })

    const newPasswordError = updatePasswordForm.querySelector("div[id=new-pw-error-div]")
    const repeatPasswordError = updatePasswordForm.querySelector("div[id=repeat-pw-error-div]")
    const newPasswordInput = updatePasswordForm.querySelector("input[name=newPassword");

    newPasswordInput.addEventListener("input", () => {
        hideError({inputElement: null, errorDivElement: newPasswordError});
        hideError({inputElement: repeatPasswordInput, errorDivElement: repeatPasswordError});
        repeatPasswordInput.classList.remove("border-success");
    });

    updatePasswordForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!repeatPasswordMatch(updatePasswordForm))
        {
            showError({inputElement: repeatPasswordInput, errorDivElement: repeatPasswordError}, "Passwords does not match.")
            return;
        }
        submitPasswordForm(updatePasswordForm);
    });
}

function handleChangeProfileForm() {
    const updateProfileForm = document.getElementById("update-profile-form");

    updateProfileForm?.addEventListener("submit", async (event) => {
        event.preventDefault()
        submitProfileForm(updateProfileForm);
    });

    const newUsernameInput = updateProfileForm.querySelector("input[name=username]");
    const newUsernameError = document.getElementById("new-username-error-div");
    newUsernameInput.addEventListener("input", () => hideError({inputElement: newUsernameInput, errorDivElement: newUsernameError}));

    const newEmailInput = updateProfileForm.querySelector("input[name=email]")
    const newEmailError = document.getElementById("new-email-error-div")
    newEmailInput.addEventListener("input", () => hideError({inputElement: newEmailInput, errorDivElement: newEmailError}));
}

function handleCommentsNotifications(currentUser) {
    const commentsCheckbox = document.getElementById("toggle-notifications");

    commentsCheckbox.checked = currentUser.notifications;

    commentsCheckbox.addEventListener("change", async () => {
        console.log("Notifications comment toggle = ", commentsCheckbox.checked);
        try
        {
            const newNotificationsState = commentsCheckbox.checked;
            const response = await fetch("/api/user/toggle-notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({newNotificationsState})
            });

            const resData = await response.json();
            printAPIResponse("/api/user/toggle-notifications", resData);
        }
        catch (error)
        {
            console.error("Error while fetching API /api/user/toggle-notifications");
        }
    })
}

function handleSettingsForms(currentUser) {
    handleChangePasswordForm();
    handleChangeProfileForm();
    handleCommentsNotifications(currentUser);
}

export function showSettingsView(currentUser) {
    let user = {
        username : currentUser ? currentUser.username : null,
        email: currentUser ? currentUser.email : null,
        notifications: currentUser.notifications
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
                        <input type="text" name="username" class="validator input input-bordered text-white ml-1" placeholder=${user.username} value=${user.username} pattern="^(?=.*[A-Za-z])(?:[A-Za-z0-9]|-)+$" minlength="3" maxlength="30" required></input>
                        <p class="validator-hint hidden ml-1">
                            Must be 3 to 30 characters<br/>
                            containing only letters, numbers or dash.
                        </p>
                    </div>
                    <div id="new-username-error-div" class="my-4 text-error hidden"></div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Email address</label>
                        <input type="email" name="email" class="validator input text-white ml-1" placeholder=${user.email} value=${user.email} required></input>
                        <p class="validator-hint hidden ml-1">
                            Email is not valid.
                        </p>
                    </div>
                    <div id="new-email-error-div" class="my-4 text-error hidden"></div>
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
                        <div id="new-pw-error-div" class="my-4 text-error hidden"></div>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Repeat new password</label>
                        <input type="password" name="repeatPassword" class="input text-white ml-1" required></input>
                    </div>
                    <div id="repeat-pw-error-div" class="my-4 text-error hidden"></div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
            <div class="flex flex-col border border-zinc-400 p-6 rounded-xl gap-5 w-full mx-auto sm:max-w-5xl">
                <div>
                    <h2 class="text-xl">Notifications</h2>
                    <p class="text-gray-600">Enable/Disable notifications</p>
                </div>
                <form id="toggle-notifications-form">
                    <label for="toggle-notifications">New comments on your posts</label>
                    <input class="toggle" type="checkbox" name="toggle-notifications" id="toggle-notifications"></input>
                    <div id="notifications-error-div" class="my-4 text-error hidden"></div>
                </form>
            </div>
        </div>
    `;

    appEl.appendChild(settingsDiv);
    handleSettingsForms(currentUser);
}
