export async function logoutUser() {
    // Call "/api/auth/logout", qui va remove le JWT.
    await updateAuthUI();
    console.log("User logged out");
}

// Retourne les infos du users grace au JWT dans les cookies. Null si pas logged.
export async function getCurrentUser() {
    try
    {
        const response = await fetch("/api/user/me");
        const user = await response.json();

        if (!response.ok)
        {
            console.log("User is not auth");
            return (null);
        }
        return (user);
    }
    catch (error)
    {
        console.log("Error while fetching /api/user/me");
        return (null);
    }
}

// Cache les choses qui ne devrait pas etre visible en fonction du logged/oupas
export async function updateAuthUI() {
    const currentUser = await getCurrentUser();
    const authButtons = document.getElementById("auth-buttons");
    const avatarMenu = document.getElementById("avatar-menu");

    // Si authenticate , on cache les bouttons auths et on affiche le menu.
    if (currentUser)
    {
        authButtons.classList.add("hidden");
        avatarMenu.classList.remove("hidden");
    }
    // Si pas authenticate , on affiche les bouttons auth et on cache le menu.
    else
    {
        authButtons.classList.remove("hidden");
        avatarMenu.classList.add("hidden");
    }
}
