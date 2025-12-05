import { getCurrentUser } from "../auth.js";
import { redirectTo } from "../navigation.js";
import { getFormValues, printAPIResponse } from "../utils.js";

let currentPage = 0;
const PAGE_SIZE = 5;

const COMMENT_MAXLENGTH = 30;
const COMMENT_MINLENGTH = 1;

const app = document.getElementById("app");
let galleryDiv = null;
let watcher = null;

// Change la couleur du coeur.
function changeHeartColor(pathElem, isLiked) {
    if (isLiked)
        pathElem.setAttribute("fill", "#FF0000");
    else
        pathElem.setAttribute("fill", "#ffffff");
}

function updateLikeCounter(likeCounterElem, likesCount) {
    likeCounterElem.textContent = `${likesCount} Likes`
}

async function likePost(post, postElem) {
    try
    {
        const currentUser = await getCurrentUser();
        if (!currentUser)
        {
            redirectTo("/login");
            return;
        }

        const response = await fetch(`/api/user/like/${post.id}`, {
            method: "POST",
            credentials: "include"
        });
        const resData = await response.json();
        printAPIResponse(`/api/user/like/${post.id}`, resData);

        if (response.ok)
        {
            // Change la couleur du coeur.
            const likeElem = postElem.querySelector("div[id=like-btn]").querySelector("path");
            changeHeartColor(likeElem, resData.liked);

            // Modifie le compteur. (Peut etre simplement faire un refresh du post ?)
            const likeCounter = postElem.querySelector("p[id=like-counter]");
            updateLikeCounter(likeCounter, resData.likes_count);
        }

    }
    catch (error)
    {
        console.error(`Error while fetching API /api/user/like//${post.id} : `, error);
    }
}

// Creer un commentaire et le rajoute dans la div comments du post selectionne.
function createComment(postElem, username, comment) {
    const commentsDiv = postElem.querySelector("div[id=comments-div]");

    const newCommentDiv = document.createElement("div");
    newCommentDiv.className = "flex gap-2";

    const userSpan = document.createElement("span");
    userSpan.className = "font-semibold";
    userSpan.textContent = username;

    const newComment = document.createElement("p");
    newComment.textContent = comment;

    newCommentDiv.appendChild(userSpan);
    newCommentDiv.appendChild(newComment);
    commentsDiv.appendChild(newCommentDiv);
}

// Affiche la div commentaire, nettoie la div et re-creer les commentaires d'un post.
function showComments(post, postElem) {
    const showCommentsDiv = postElem.querySelector("div[id=show-comments]");

    // Permet de cacher si re-click.
    if (showCommentsDiv.checkVisibility() === true)
    {
        showCommentsDiv.classList.add("hidden");
        return;
    }

    showCommentsDiv.classList.remove("hidden");

    const commentsDiv = postElem.querySelector("div[id=comments-div]");

    // Remove les commentaires pour eviter de les dupliquers.
    while (commentsDiv.firstChild)
        commentsDiv.removeChild(commentsDiv.firstChild);

    for (let i = 0; i < post.comments.length; i++)
    {
        const commentData = post.comments[i];
        createComment(postElem, commentData.username, commentData.content);
    }

}

async function resfreshImageComments(post) {
    try
    {
        const response = await fetch(`/api/user/image-comments/${post.id}`);
        const resData = await response.json();
        printAPIResponse(`/api/user/image-comments/${post.id}`, resData);

        if (response.ok)
            post.comments = resData.comments;
    }
    catch (error)
    {
        console.error(`Error while fetching API /api/user/image-comments/${post.id} : `, error);
    }
}

// TODO : Parser le comment cote front
async function postComment(post, form, postElem) {
    // Recuperer la valeur de textarea.
    const comment = getFormValues(form);

    try
    {
        const currentUser = await getCurrentUser();
        if (!currentUser)
        {
            redirectTo("/login");
            return;
        }

        const response = await fetch(`/api/user/post-comment/${post.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comment)
        });

        const resData = await response.json();
        printAPIResponse(`/api/user/post-comment/${post.id}`, resData);

        if (response.ok)
        {
            // Refresh les commentaires ?
            await resfreshImageComments(post);
            createComment(postElem, resData.comment.username, resData.comment.content);
        }
    }
    catch (error)
    {
        console.error(`Error while fetching API /api/user/post-comment/${post.id} : `, error);
    }
}

async function checkUserLikedPost(post) {
    const currentUser = await getCurrentUser();

    if (!currentUser)
        return (false);

    for (let i = 0; i < post.liked_by.length; i++)
    {
        if (post.liked_by[i].user_id === currentUser.id)
            return (true);
    }
    return (false);
}

async function createPost(userPost) {
    console.log("Creating post : ", userPost);

    const userLikedPost = await checkUserLikedPost(userPost);


    const newPost = document.createElement("div");
    newPost.innerHTML = /*html*/ `
        <div id="card" class="flex flex-col gap-2 border-2 rounded-md w-full max-w-[518px] mx-auto">
            <div class="flex items-center px-2 pt-2">
                <div class="avatar mr-2">
                    <div class="w-10 rounded-full">
                        <img id="user-avatar" src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                    </div>
                </div>
                <p id="username-card"></p>
            </div>
            <img id="user-post" class="w-full"></img>
            <div class="flex gap-2 m-1">
                <div id="like-btn" class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-8 text-white" viewBox="0 0 640 640">
                        <path fill=${userLikedPost ? "#FF0000" : "#ffffff"} d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/>
                    </svg>
                </div>
                <div id="comments-btn" class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-8" viewBox="0 0 640 640">
                        <path fill="#ffffff" d="M115.9 448.9C83.3 408.6 64 358.4 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304C576 436.5 461.4 544 320 544C283.5 544 248.8 536.8 217.4 524L101 573.9C97.3 575.5 93.5 576 89.5 576C75.4 576 64 564.6 64 550.5C64 546.2 65.1 542 67.1 538.3L115.9 448.9zM153.2 418.7C165.4 433.8 167.3 454.8 158 471.9L140 505L198.5 479.9C210.3 474.8 223.7 474.7 235.6 479.6C261.3 490.1 289.8 496 319.9 496C437.7 496 527.9 407.2 527.9 304C527.9 200.8 437.8 112 320 112C202.2 112 112 200.8 112 304C112 346.8 127.1 386.4 153.2 418.7z"/>
                    </svg>
                </div>
            </div>
            <p id="like-counter" class="px-2">${userPost.liked_by.length} Likes</p>
            <p id="view-comments" class="px-2 cursor-pointer">View comments</p>
            <div id="show-comments" class="px-2 my-2 hidden">
                <div id="comments-div">
                </div>
                <form id="comment-form" class="mt-1">
                    <textarea id="comment" class="resize-none focus:outline-hidden" placeholder="Add a comment.." name="comment" rows=1 minlength=${COMMENT_MINLENGTH} maxlength=${COMMENT_MAXLENGTH} required></textarea>
                    <button class="" type="submit">Post</button>
                </form>
            </div>
        </div>`

    // Mieux pour ce premunir d'attaques XSS.
    const usernameCard = newPost.querySelector("p[id=username-card]");
    usernameCard.textContent = userPost.username;

    const userPostImg = newPost.querySelector("img[id=user-post]");
    userPostImg.src = userPost.img_path;
    //

    const likeBtn = newPost.querySelector("div[id=like-btn]");
    likeBtn.addEventListener("click", () => likePost(userPost, newPost));

    const viewCommentBtn = newPost.querySelector("p[id=view-comments]");
    viewCommentBtn.addEventListener("click", () => showComments(userPost, newPost));

    const showCommentBtn = newPost.querySelector("div[id=comments-btn]");
    showCommentBtn.addEventListener("click", () => showComments(userPost, newPost));

    const commentTextArea = newPost.querySelector("textarea[id=comment]");
    commentTextArea.addEventListener("keypress", (event) => {
        if (event.which === 13)
        {
            event.preventDefault(); // Empeche le retour a la ligne avec Enter

            // Declenche un event submit pour le form.
            const newEvent = new Event("submit", {cancelable: true});
            commentForm.dispatchEvent(newEvent);
        }
    })

    const commentForm = newPost.querySelector("form[id=comment-form]");
    commentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        commentTextArea.value = commentTextArea.value.trim();
        if (!isValidComment(commentTextArea.value))
            return;

        postComment(userPost, commentForm, newPost);
        commentTextArea.value = ""; // Reset le textarea.
    });


    galleryDiv.appendChild(newPost);
}

function isValidComment(comment) {
    if (comment.length < COMMENT_MINLENGTH || comment > COMMENT_MAXLENGTH)
        return (false);
    return (true);
}

async function getAllUsersImages() {
    try
    {
        const response = await fetch("/api/user/gallery-posts");
        const resData = await response.json();
        printAPIResponse("/api/user/gallery-posts", resData);

        if (response.ok)
            return (resData.all_images);
        else
            return (null);
    }
    catch (error)
    {
        console.error("Error while fetching API /api/user/gallery-posts : ", error);
    }
}

async function getUsersImagesPage(page, limit) {
    try
    {
        const response = await fetch(`/api/user/gallery-posts?page=${page}&limit=${limit}`);
        const resData = await response.json();
        printAPIResponse(`/api/user/gallery-posts?page=${page}&limit=${limit}`, resData);

        if (response.ok)
            return (resData.all_images);
        else
            return (null);
    }
    catch (error)
    {
        console.error(`Error while fetching API /api/user/gallery-posts?page=${page}&limit=${limit}`, error);
    }
}

async function handleIntersect(entries, observer) {
   const entry = entries[0];  // Array d'elements observes , on en que 1 alors c'est le [0].
    if (!entry.isIntersecting)
        return ;

    console.log(`REQUESTING ${PAGE_SIZE} POSTS FOR PAGE ${currentPage}`);
    const allPosts = await getUsersImagesPage(currentPage, PAGE_SIZE);
    if (!allPosts || allPosts.length === 0)
    {
        console.log("No new posts , stopping observer.");
        observer.unobserve(watcher);
        return;
    }

    for (let i = 0; i < allPosts.length; i++)
        await createPost(allPosts[i]);

    currentPage++;
}

async function infiniteScroll(viewDiv) {
    currentPage = 0;
    watcher = null;

    // On creer un element que l'on surveillera.
    watcher = document.createElement("div");
    watcher.id = "intersection-watcher";
    viewDiv.appendChild(watcher);

    const newObserver = new IntersectionObserver(handleIntersect);
    newObserver.observe(watcher);
}

export async function showGalleryView() {
    const viewDiv = document.createElement("div");
    viewDiv.className = "my-5";

    galleryDiv = document.createElement("div");
    galleryDiv.className = "flex flex-col gap-5 mx-2"
    viewDiv.appendChild(galleryDiv);

    app.appendChild(viewDiv);

    infiniteScroll(viewDiv);
}
