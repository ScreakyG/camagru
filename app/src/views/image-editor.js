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
        </div>
    `

    const inputElement = imageEditorDiv.querySelector("input[type=file]");
    inputFileDebugger(inputElement);
    inputElement.addEventListener("change", () => updateImageDisplay(inputElement));

    app.appendChild(imageEditorDiv);
}
