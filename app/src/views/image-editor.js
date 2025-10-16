import { getFormValues, printAPIResponse } from "../utils.js";

// Lister ici les types d'images que l'on accepte.
const fileTypes = [
    "image/jpeg",
    "image/png",
];

// Valeurs a revoir
let streaming = false;
let mediaStream = null;
let canvasHeight = 1080;
let canvasWidth = 1080;


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

// Clean les fichiers selectionnees dans l'input.
function resetInputElement() {
    const inputElement = document.getElementById("file-viewer").querySelector("input[type=file]");
    inputElement.value = "";
    inputElement.dispatchEvent(new Event("change", { bubbles: true }));
}

// Show <video> element and hide <img>
function showVideoStream() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    video.classList.remove("hidden");
    canvas.classList.add("hidden");
}

// Hide <video> element and show <img>
function hideVideoStream() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    stopWebcam();
    video.classList.add("hidden");
    canvas.classList.remove("hidden");
}

function stopWebcam() {
    const video = document.getElementById("video");
    try
    {
        video.pause();
        if (mediaStream)
        {
            const activeStreams = mediaStream.getTracks();
            for (let i = 0; i < activeStreams.length; i++)
                activeStreams[i].stop();
            mediaStream = null;
        }
        video.srcObject = null;
    }
    catch (error)
    {
        console.log("Error while stopping webcam : ", error);
    }
}

function showWebcamErrors(errorMessage) {
    const errorDiv = document.getElementById("file-viewer").querySelector("div[id=webcam-errors]");
    const error = document.createElement("p");
    error.innerHTML = `Can't access webcam. Please allow access to webcam to use your camera as image source.</br> Details : ${errorMessage}`;
    errorDiv.appendChild(error);
    errorDiv.classList.remove("hidden");
}

function hideWebcamErrors() {
    const errorDiv = document.getElementById("file-viewer").querySelector("div[id=webcam-errors]");
    const error = errorDiv.querySelector("p");
    if (error)
        error.remove();
    errorDiv.classList.add("hidden");
}


function updateImageDisplay(inputElement) {
    hideWebcamErrors();
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

function handleSubmitButtonInteraction(viewDiv, form) {
    const submitBtn = viewDiv.querySelector("button[type=submit]");
    const formValues = getFormValues(form);

    if (formValues.image_upload && isValidInputFile(formValues.image_upload) && formValues.overlay)
        submitBtn.removeAttribute("disabled")
    else
        submitBtn.setAttribute("disabled", "");
}

function previewTest(inputElement) {
    const file = inputElement.files[0];

    hideVideoStream();
    // Si le fichier n'est pas valide on affiche le default placeholder.
    if (isValidInputFile(file))
        drawImageToCanvas(file);
    // else
    //     Dessiner le placeholder sur le canvas ?
}

/**
 * Demande l'acces a un media de capture.
 * Recupere le stream du media et l'affiche dans l'element video.
 */
async function webcamTests(viewDiv) {
    resetInputElement();
    hideWebcamErrors();

    try
    {
        const devices = await navigator.mediaDevices.enumerateDevices();
        for (let i = 0; i < devices.length; i++)
            console.log("Available devices : ", devices[i]);

        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: canvasWidth },
                height: { ideal: canvasHeight }
            },
            audio: false
        });
        console.log(mediaStream);

        const video = document.getElementById("video");
        video.srcObject = mediaStream;
        video.play();

        showVideoStream()
    }
    catch (error)
    {
        console.log(error);
        showWebcamErrors(error.message);
    }
}

/**
 * Converti un canvas en un fichier utilisable dans un input.
 * Declenche un event change dans l'input pour que il soit gerer dans mon autre fonction d'affichage.
 */
async function convertCanvasToFile(canvas, { type = "image/jpeg", quality = 0.92, name = "capture.jpg" } = {}) {
    const inputElement = document.getElementById("file-viewer").querySelector("input[type=file]");

    try
    {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, type, quality));
        if (!blob)
            throw new Error("toBlob failed");

        const file = new File([blob], name, { type, lastModified: Date.now() });
        const dt = new DataTransfer();
        dt.items.add(file);
        inputElement.files = dt.files;

        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    }
    catch (error)
    {
        console.log(error);
    }

}

/**
 * Prend une capture du stream de video en le dessinant sur un canvas.
 */
function takePicture(viewDiv) {
    const video = document.getElementById("video");
    const canvasEl = document.getElementById("canvas");
    const context = canvasEl.getContext("2d");
    if (canvasWidth && canvasHeight)
    {
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;
        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);

        hideVideoStream();
        convertCanvasToFile(canvasEl);
    }
}

async function drawImageToCanvas(file) {
    const canvasEl = document.getElementById("canvas");
    const context = canvasEl.getContext("2d");

    const imageSrc = await createImageBitmap(file, { imageOrientation: 'from-image' });


    canvasEl.width = canvasWidth;
    canvasEl.height = canvasHeight;
    context.clearRect(0, 0, canvasEl.width, canvasEl.height);
    context.drawImage(imageSrc, 0, 0, canvasEl.width, canvasEl.height);
}


export function showImageEditorView() {
    const app = document.getElementById("app");

    const imageEditorDiv = document.createElement("div");
    imageEditorDiv.innerHTML = /*html*/ `
        <div class="text-black bg-zinc-200 min-h-dvh flex flex-col items-center">
            <h1 class="text-2xl text-center my-10">Editor</h1>
            <form class="flex flex-col gap-5">
                <div id="file-viewer" class="min-h-30 p-6 border-zinc-400 rounded-xl border sm:max-w-7xl mx-auto w-full">
                    <div class="flex flex-col gap-5">
                        <div class="flex justify-between items-center">
                            <h2>Choose a image</h2>
                            <div>
                                <label for="image_upload_input" class="btn">Upload a image (PNG, JPG)</label>
                                <input class="opacity-0 sr-only" type="file" id="image_upload_input" name="image_upload" accept="image/*" required></input>
                                <button id="request_webcam" type="button" class="btn">Use webcam</button>
                            </div>
                        </div>
                        <div id="webcam-errors" class="border py-2 px-3 border-red-300 bg-red-200 text-red-700 rounded-md hidden">
                        </div>
                        <div id="upload_preview">
                            <p>No files currently selected for upload.</p>
                        </div>
                    </div>
                </div>
                <div id="editing-area" class="grid grid-cols-5 grid-rows-5 gap-4 mx-auto sm:max-w-7xl h-[50vh] min-h-0">
                    <div id="preview-img" class="flex relative justify-center items-center min-w-0 min-h-0 overflow-hidden col-span-3 col-start-2 row-span-5 row-start-1 border rounded-xl border-zinc-400 bg-zinc-300">
                        <div class="w-full">
                            <p>Remettre video et canvas ici </p>
                        </div>
                    </div>
                    <fieldset id="overlays" class="overflow-auto min-w-0 min-h-0 flex flex-col col-span-1 col-start-1 row-span-5 row-start-1 justify-center-safe gap-5 border rounded-xl border-zinc-400 p-5">
                        <p class="text-center">Select a Overlay</p>
                        <input id="smile1" type="radio" name="overlay" value="smile1" class="peer/overlay1 hidden" required></input>
                        <label for="smile1" class="peer-checked/overlay1:border-black flex items-center justify-center aspect-square border rounded-xl p-2 border-zinc-400">
                            <img class="" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
                        </label>
                        <input id="smile2" type="radio" name="overlay" value="smile2" class="peer/overlay2 hidden"></input>
                        <label for="smile2" class="peer-checked/overlay2:border-black flex items-center justify-center aspect-square border rounded-xl p-2 border-zinc-400">
                            <img class="" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
                        </label>
                        <input id="smile3" type="radio" name="overlay" value="smile3" class="peer/overlay3 hidden"></input>
                        <label for="smile3" class="peer-checked/overlay3:border-black flex items-center justify-center aspect-square border rounded-xl p-2 border-zinc-400">
                            <img class="" alt="Smile" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8Y2lyY2xlIGN4PSIzNSIgY3k9IjQwIiByPSI1IiBmaWxsPSIjMzMzMzMzIi8+CjxjaXJjbGUgY3g9IjY1IiBjeT0iNDAiIHI9IjUiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTMwIDY1IFE1MCA3NSA3MCA2NSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4="></img>
                        </label>
                    </fieldset>
                    <div id="feed" class="overflow-auto min-w-0 min-h-0 flex flex-col justify-center-safe gap-5 p-5 col-span-1 col-start-5 row-span-5 row-start-1 border rounded-xl border-zinc-400">
                        <p class="text-center">Feed</p>
                        <img class="aspect-square rounded-xl" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg==" alt="Image_preview"></img>
                        <img class="aspect-square rounded-xl" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg==" alt="Image_preview"></img>
                        <img class="aspect-square rounded-xl" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg==" alt="Image_preview"></img>
                        <img class="aspect-square rounded-xl" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg==" alt="Image_preview"></img>
                    </div>
                </div>
                <button type="submit" class="btn btn-success mx-auto disabled:btn-error" disabled>Publish</button>
                <div>
                    <button type="button" id="start-button" class="btn">Capture</button>
                    <div class="relative aspect-square w-full">
                        <video class="absolute inset-0 w-full h-full hidden" id="video">Video stream not available.</video>
                        <canvas class="absolute inset-0 w-full h-full bg-amber-200 " id="canvas"></canvas>
                    </div>
                </div>
            </form>
        </div>
    `



    // Placeholder
    // src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg=="

    const inputElement = imageEditorDiv.querySelector("input[type=file]");
    inputFileDebugger(inputElement);
    inputElement.addEventListener("change", () => updateImageDisplay(inputElement));
    inputElement.addEventListener("change", () => previewTest(inputElement));

    const useWebcamBtn = imageEditorDiv.querySelector("button[id=request_webcam]");
    useWebcamBtn.addEventListener("click", () => webcamTests(imageEditorDiv));

    const startBtn = imageEditorDiv.querySelector("button[id=start-button]");
    startBtn.addEventListener("click", (event) => {
        takePicture(imageEditorDiv);
        event.preventDefault();
    })

    const editorForm = imageEditorDiv.querySelector("form");
    editorForm.addEventListener("change", () => handleSubmitButtonInteraction(imageEditorDiv, editorForm));
    editorForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = getFormValues(editorForm);
        console.log(data);
    });

    app.appendChild(imageEditorDiv);
}
