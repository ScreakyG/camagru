import { getCurrentUser, updateAuthUI } from "./auth.js";
import { showVerifiedAccountSuccess } from "./views/verified.js";
import { showLoginModal, showRegisterModal } from "./utils.js";
import { redirectTo } from "./navigation.js";

export async function router() {
    const currentUser = await getCurrentUser();
    const currentPath = window.location.pathname;
    console.log("Current User = ", currentUser ? currentUser.user : null);
    console.log("Current Path = ", currentPath);

    // Update what should be shown if user is logged/not logged.
    await updateAuthUI();


    switch (currentPath) {
        case "/verified":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showVerifiedAccountSuccess();
            break;

        case "/login":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showLoginModal();
            break;

        case "/register":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showRegisterModal();
            break;

        default:
            // Afficher une page 404 ?
            break;
    }
}
