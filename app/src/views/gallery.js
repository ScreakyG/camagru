// Variables temporaires pour tests.

const app = document.getElementById("app");
const galleryPosts = [
    {
        image_id: 1,
        img_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLixYgVKW7F62X-BB2G_mU4LTyINUmtpzLlg&s",
        username: "Yka",
        likes: 32
    },
    {
        image_id: 2,
        img_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLixYgVKW7F62X-BB2G_mU4LTyINUmtpzLlg&s",
        username: "Neymar",
        likes: 2
    }
];

function likePost(post) {
    console.log("You liked the image : ", post);
}

function commentPost(post) {
    console.log("You comment the image : ", post);
}

function createPost(userPost) {
    const newPost = document.createElement("div");
    newPost.innerHTML = /*html*/ `
        <div id="card" class="flex flex-col gap-2 border-2 w-[518px] rounded-md">
            <div class="flex items-center px-2 pt-2">
                <div class="avatar mr-2">
                    <div class="w-10 rounded-full">
                        <img id="user-avatar" src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                    </div>
                </div>
                <p id="username-card">${userPost.username}</p>
            </div>
            <img id="user-post" class="w-full" src=${userPost.img_path}></img>
            <div class="flex gap-2 m-1">
                <div id="like-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-8 text-white" viewBox="0 0 640 640">
                        <path fill="#ffffff" d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/>
                    </svg>
                </div>
                <div id="comments-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-8" viewBox="0 0 640 640">
                        <path fill="#ffffff" d="M115.9 448.9C83.3 408.6 64 358.4 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304C576 436.5 461.4 544 320 544C283.5 544 248.8 536.8 217.4 524L101 573.9C97.3 575.5 93.5 576 89.5 576C75.4 576 64 564.6 64 550.5C64 546.2 65.1 542 67.1 538.3L115.9 448.9zM153.2 418.7C165.4 433.8 167.3 454.8 158 471.9L140 505L198.5 479.9C210.3 474.8 223.7 474.7 235.6 479.6C261.3 490.1 289.8 496 319.9 496C437.7 496 527.9 407.2 527.9 304C527.9 200.8 437.8 112 320 112C202.2 112 112 200.8 112 304C112 346.8 127.1 386.4 153.2 418.7z"/>
                    </svg>
                </div>
            </div>
            <p class="px-2">${userPost.likes} Likes</p>
            <p class="px-2">View comments</p>
        </div>`

    const likeBtn = newPost.querySelector("div[id=like-btn]");
    likeBtn.addEventListener("click", () => likePost(userPost));

    const commentBtn = newPost.querySelector("div[id=comments-btn]");
    commentBtn.addEventListener("click", () => commentPost(userPost));

    app.appendChild(newPost);
}

export function showGalleryView() {
    for (let i = 0; i < galleryPosts.length; i++)
        createPost(galleryPosts[i]);
}
