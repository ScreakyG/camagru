export function showImageEditorView() {
    console.log("This is the editor view");

    const app = document.getElementById("app");
    console.log(app);

    const imageEditorDiv = document.createElement("div");
    imageEditorDiv.innerHTML = /*html*/ `
        <div class="text-black flex flex-col gap-5 bg-zinc-200 min-h-dvh px-4 py-8">
            <h1 class="text-2xl text-center">Editor</h1>
            <div class="h-50 p-6 border-zinc-400 rounded-xl border sm:max-w-5xl mx-auto w-full">
                Content
            </div>
            <div class="h-50 p-6 border-zinc-400 rounded-xl border sm:max-w-5xl mx-auto w-full">
                Content
            </div>
        </div>
    `
    app.appendChild(imageEditorDiv);
}
