import { getCurrentUser, updateAuthUI } from "./auth.js";
import { showForgotPasswordModal } from "./views/password-forgot.js";
import { showPasswordResetModal } from "./views/password-reset.js";
import { showVerifyStatus } from "./views/verify.js";
import { showLoginModal, showRegisterModal } from "./utils.js";
import { redirectTo } from "./navigation.js";
import { cleanPreviousView } from "./cleaning.js";
import { showSettingsView } from "./views/settings.js";
import { showImageEditorView } from "./views/image-editor.js";
import { showGalleryView } from "./views/gallery.js";

// Catching all events and preventing default behavior of <a> to prevent page refresh.
export function handleAnchors() {
    let body = document.querySelector("body");

    body?.addEventListener("click", (event) => {
        const target = event.target.closest("a");

        if (target instanceof HTMLAnchorElement)
        {
            event.preventDefault();
            const href = target.getAttribute("href");
            window.history.pushState(null, "", href);
            router();
        }
    })
}

export async function router() {
    const currentUser = await getCurrentUser();
    const currentPath = window.location.pathname;
    console.log("Current User = ", currentUser ? currentUser : null);
    console.log("Current Path = ", currentPath);

    cleanPreviousView();
    // Update what should be shown if user is logged/not logged.
    await updateAuthUI();

    switch (currentPath) {
        case "/":
            redirectTo("/gallery");
            break;

        case "/verify":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showVerifyStatus();
            break;

        case "/login":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showLoginModal();
            break;

        case "/forgot-password":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showForgotPasswordModal();
            break;

        case "/register":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showRegisterModal();
            break;

        case "/reset-password":
            if (currentUser)
            {
                redirectTo("/");
                break ;
            }
            showPasswordResetModal();
            break;

        case "/settings":
            if (!currentUser)
            {
                redirectTo("/login");
                break;
            }
            showSettingsView(currentUser);
            break;

        case "/image-editor":
            if (!currentUser)
            {
                redirectTo("/login");
                break;
            }
            showImageEditorView();
            break;

        case "/gallery":
            showGalleryView();
            break;

        default:
            // Afficher une page 404 ?
            break;
    }
}
