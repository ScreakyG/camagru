export function cleanPreviousView() {
    closeOpenedModals();
}

export function closeOpenedModals() {
    const openedModals = document.querySelectorAll("dialog[open]");
    for (let i = 0; i < openedModals.length; i++)
    {
        console.log("This modal will be closed : ", openedModals[i]);
        openedModals[i].close();
    }
    // openedModals?.forEach(modal => modal.close());
}
