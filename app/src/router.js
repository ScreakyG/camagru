async function getCurrentUser() {
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

export async function router() {
    const currentUser = await getCurrentUser();

    if (currentUser)
    {
        const authButtons = document.getElementById("auth-buttons");
        authButtons.classList.add("hidden");

        const avatarMenu = document.getElementById("avatar-menu");
        avatarMenu.classList.remove("hidden");
    }
    else
    {
        const authButtons = document.getElementById("auth-buttons");
        authButtons.classList.remove("hidden");

        const avatarMenu = document.getElementById("avatar-menu");
        avatarMenu.classList.add("hidden");
    }
}
