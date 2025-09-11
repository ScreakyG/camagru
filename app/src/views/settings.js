export function showSettingsView(params) {
    console.log("This is the setting view");

    const appEl = document.getElementById('app');
    const settingsDiv = document.createElement("div");
    settingsDiv.innerHTML = /*html*/
    `<h1>Hello World</h1>`;

    appEl.appendChild(settingsDiv);
}
