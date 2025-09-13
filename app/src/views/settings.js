export function showSettingsView() {
    console.log("This is the setting view");

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
                <form>
                    <div class="flex flex-col">
                        <label class="mb-1">Username</label>
                        <input type="text" class="input input-bordered text-white ml-1" placeholder="JohnDoe"></input>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Email address</label>
                        <input type="email" class="input text-white ml-1" placeholder="johndoe@gmail.com"></input>
                    </div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
            <div class="flex flex-col border border-zinc-400 p-6 rounded-xl gap-5 w-full mx-auto sm:max-w-5xl">
                <div>
                    <h2 class="text-xl">Change password</h2>
                    <p class="text-gray-600">Set a new password</p>
                </div>
                <form>
                    <div class="flex flex-col">
                        <label class="mb-1">New password</label>
                        <input type="password" class="input input-bordered text-white ml-1" placeholder="*********"></input>
                    </div>
                    <div class="flex flex-col my-5">
                        <label class="mb-1">Repeat new password</label>
                        <input type="password" class="input text-white ml-1"></input>
                    </div>
                    <button type="submit" class="btn btn-primary ml-1">Save</button>
                </form>
            </div>
        </div>
    `;
}
