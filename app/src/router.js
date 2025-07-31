import { updateAuthUI } from "./auth.js";

export async function router() {
    // Update what should be shown if user is logged/not logged.
    await updateAuthUI();
}
