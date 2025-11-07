function likeImage(params) {
    console.log("You liked the image.");
}

function commentImage() {
    console.log("You comment the image");
}

export function showGalleryView() {
    console.log("This is the gallery view.");
    const imgPost = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLixYgVKW7F62X-BB2G_mU4LTyINUmtpzLlg&s"

    const app = document.getElementById("app");
    const galleryDiv = document.createElement("div");
    galleryDiv.innerHTML = /*html*/ `
        <div id="card" class="flex flex-col gap-2 border-2 w-[518px] rounded-md">
            <div class="flex items-center px-2 pt-2">
                <div class="avatar mr-2">
                    <div class="w-10 rounded-full">
                        <img id="user-avatar" src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                    </div>
                </div>
                <p id="username-card">Username</p>
            </div>
            <img id="user-post" class="w-full" src=${imgPost}></img>
            <div class="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-8" viewBox="0 0 640 640">
                    <path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/>
                </svg>
            </div>
            <button type="button">View comments</button>
        </div>
    `

    app.appendChild(galleryDiv);
}
