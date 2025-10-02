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

function updateImageDisplay(inputElement) {
 /*
  * TODO:
  *     1/ Nettoyer le contenu de la div preview.
  *     2/ Recuperer le file dans input.
  *     3/ Verifier que il y'a un bien un fichier.
  *     4/ Verifier a nouveau que le format est adequate a l'attribit "accept" de l'input.
  *     5/ Afficher l'image ou un message d'erreur si invalide.
  */
    const previewDiv = document.getElementById("upload_preview");

    // Nettoyage de la div a chaque changements dans l'input.
    while (previewDiv.firstChild)
    {
        console.log(previewDiv.firstChild)
        previewDiv.removeChild(previewDiv.firstChild);
    }

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
            listItem.className = "mt-2 p-4 flex justify-between items-center border rounded-md";

            const para = document.createElement("p");

            // Verifier le type du fichier (png, jpg..);
            para.textContent = `File name ${file.name}, file size ${file.size} bytes.`;

            const image = document.createElement("img");
            image.src = URL.createObjectURL(file);
            image.alt = image.title = file.name;
            image.className = "size-16"

            listItem.appendChild(para);
            listItem.appendChild(image);
            list.appendChild(listItem);
        }

    }
}

export function showImageEditorView() {
    console.log("This is the editor view");

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
