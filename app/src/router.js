import { updateAuthUI } from "./auth.js";
import { showVerifiedAccountSuccess } from "./views/verified.js";
import { showLoginModal } from "./utils.js";

export async function router() {
    // Update what should be shown if user is logged/not logged.
    await updateAuthUI();
    const currentPath = window.location.pathname;
    console.log("Current Path = ", currentPath);

    switch (currentPath) {
        case "/verified":
            showVerifiedAccountSuccess();
            break;

        case "/login":
            showLoginModal();
            break;
            
        default:
            break;
    }
}
