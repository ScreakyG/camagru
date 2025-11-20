import { redirectTo } from "./navigation.js";
import { printAPIResponse } from "./utils.js";

// Call "/api/auth/logout", qui va remove le JWT.
export async function logoutUser() {
    try
    {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        const resData = await response.json();
        if (!response.ok)
        {
            printAPIResponse("/api/auth/logout", resData);
            return ;
        }
        printAPIResponse("/api/auth/logout", resData);
        redirectTo("/");
    }
    catch (error)
    {
        console.error("Error while fetching API /api/auth/logout");
    }
}

// Retourne les infos du users grace au JWT dans les cookies. Null si pas logged.
export async function getCurrentUser() {
    try
    {
        const response = await fetch("/api/user/me");
        const resData = await response.json();

        printAPIResponse("/api/user/me", resData);
        if (!response.ok)
            return (null);
        return (resData.user);
    }
    catch (error)
    {
        console.error("Error while fetching API /api/user/me");
        return (null);
    }
}

// Cache les choses qui ne devrait pas etre visible en fonction du logged/oupas
export async function updateAuthUI() {
    const currentUser = await getCurrentUser();
    const authButtons = document.getElementById("auth-buttons");
    const avatarMenu = document.getElementById("avatar-menu");
    const logoutBtn = document.getElementById("logout-btn");
    const imageEditorBtn = document.getElementById("image-editor-btn");

    if (currentUser)
    {
        authButtons.classList.add("hidden");
        avatarMenu.classList.remove("hidden");
        logoutBtn.classList.remove("hidden");
        imageEditorBtn.classList.remove("hidden");
    }
    else
    {
        authButtons.classList.remove("hidden");
        avatarMenu.classList.add("hidden");
        logoutBtn.classList.add("hidden");
        imageEditorBtn.classList.add("hidden");
    }
}
