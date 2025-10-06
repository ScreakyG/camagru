// Lister ici les types d'images que l'on accepte.
const fileTypes = [
    "image/jpeg",
    "image/png",
];

function inputFileDebugger(inputElement) {
    console.log(inputElement);

    inputElement.addEventListener("cancel", () => {
        console.log("User cancelled upload.");
    })

    inputElement.addEventListener("change", () => {
        if (inputElement.files.length === 1)
            console.log("File selected: ", inputElement.files[0]);
    });
}

function isValidInputFile(file) {
    if (file && fileTypes.includes(file.type))
        return (true);
    return (false);
}

function returnFileSize(number) {
    if (number < 1e3)
        return `${number} bytes`;
    else if (number >= 1e3 && number < 1e6)
        return `${(number / 1e3).toFixed(1)} KB`;
    return `${(number / 1e6).toFixed(1)} MB`;
}

function updateImageDisplay(inputElement) {
    const previewDiv = document.getElementById("upload_preview");

    // Nettoyage de la div a chaque changements dans l'input.
    while (previewDiv.firstChild)
        previewDiv.removeChild(previewDiv.firstChild);

    const inputFiles = inputElement.files;
    console.log(inputFiles);

    if (inputFiles.length === 0)
    {
        const para = document.createElement("p");
        para.textContent = "No files currently selected for upload";
        previewDiv.appendChild(para);
    }
    else
    {
        const list = document.createElement("ol");
        previewDiv.appendChild(list);

        for (const file of inputFiles)
        {
            const listItem = document.createElement("li");
            const para = document.createElement("p");
            listItem.className = "mt-2 p-4 flex justify-between items-center border rounded-md";
            if (isValidInputFile(file))
            {
                para.textContent = `File name ${file.name}, file size  ${returnFileSize(file.size)}.`;
                const image = document.createElement("img");
                image.src = URL.createObjectURL(file);
                image.alt = image.title = file.name;
                image.className = "size-16"

                listItem.appendChild(image);
            }
            else
                para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
            listItem.appendChild(para);
            list.appendChild(listItem);
        }
    }
}

function testFillPreview(inputFile) {
    const file = inputFile.files[0];

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = file.name;
    image.className = "absolute inset-0 size-20 object-cover pointer-events-none rounded-xl";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "absolute top-2 left-2 btn btn-error";
    cancelBtn.textContent = "Cancel";
    cancelBtn.type = "button";

    const testImg = document.createElement("img");
    const imgUrl = URL.createObjectURL(file);
    console.log(imgUrl);
    testImg.src = URL.createObjectURL(file);
    testImg.alt = file.name;
    testImg.className = "size-20";

    const previewDiv = document.getElementById("preview");
    previewDiv.classList.add(`bg-[url(${imgUrl})]`)
    // previewDiv.appendChild(image);
    // previewDiv.appendChild(testImg);
    previewDiv.appendChild(cancelBtn);
}

export function showImageEditorView() {
    const app = document.getElementById("app");
    console.log(app);

    const imageEditorDiv = document.createElement("div");
    imageEditorDiv.innerHTML = /*html*/ `
        <div class="text-black flex flex-col gap-5 bg-zinc-200 min-h-dvh px-4 py-8">
            <h1 class="text-2xl text-center">Editor</h1>
            <div class="min-h-50 p-6 border-zinc-400 rounded-xl border sm:max-w-5xl mx-auto w-full">
                <form class="flex flex-col gap-5">
                    <div>
                        <label for="image_upload_input" class="btn">Choose images to upload (PNG, JPG)</label>
                        <input class="opacity-0" type="file" id="image_upload_input" name="image_upload" accept="image/*" required></input>
                    </div>
                    <div class="" id="upload_preview">
                        <p>No files currently selected for upload.</p>
                    </div>
                    <button class="btn">Upload</button>
                </form>
            </div>

            <div id="preview" class="relative flex flex-col gap-2 justify-center items-center min-h-50 py-20 bg-zinc-300 border-zinc-400 rounded-xl border sm:max-w-5xl mx-auto w-full">
                <svg class="size-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path class="fill-zinc-500" d="M193.1 32c-18.7 0-36.2 9.4-46.6 24.9L120.5 96 64 96C28.7 96 0 124.7 0 160L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64l-56.5 0-26-39.1C355.1 41.4 337.6 32 318.9 32L193.1 32zm-6.7 51.6c1.5-2.2 4-3.6 6.7-3.6l125.7 0c2.7 0 5.2 1.3 6.7 3.6l33.2 49.8c4.5 6.7 11.9 10.7 20 10.7l69.3 0c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l69.3 0c8 0 15.5-4 20-10.7l33.2-49.8zM256 384a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 272a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/>
                </svg>
                <p class="text-zinc-500">No webcam found</p>
                <label for="image_upload_input" class="btn max-w-48">Upload a image</label>
                <input class="opacity-0 hidden" type="file" id="" name="image_upload" accept="image/*" required></input>
            </div>
            <div class="flex justify-center-safe gap-5 border rounded-xl border-zinc-400 p-3" id="overlays">
                <img class="border-2 rounded-xl p-2 border-zinc-400" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
                <img class="border-2 rounded-xl p-2 border-zinc-400" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
                <img class="border-2 rounded-xl p-2 border-zinc-400" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
            <div>
        </div>
    `

    const inputElement = imageEditorDiv.querySelector("input[type=file]");
    inputFileDebugger(inputElement);
    inputElement.addEventListener("change", () => updateImageDisplay(inputElement));
    inputElement.addEventListener("change", () => testFillPreview(inputElement));

    app.appendChild(imageEditorDiv);
}
