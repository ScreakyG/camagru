import { router } from "./router.js";

export function redirectTo(url) {
    window.history.pushState({}, "", url);
    router();
}
