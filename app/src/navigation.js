import { router } from "./router.js";
import { stopWebcam } from "./views/image-editor.js";

export function redirectTo(url) {
    window.history.pushState({}, "", url);
    router();
}

export function handleForwardAndBackward() {
    window.addEventListener("popstate", () => {
        if (window.location.pathname !== "/image-editor")
            stopWebcam();
        router()
    });
}

