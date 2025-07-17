async function submitForm(params) {
    try
    {
        const response = await fetch("/api/", {
            method: "GET"
        })
        const resData = await response.json();
        if (!response.ok)
            console.log("Fetch Failed : ", resData);
        else
            console.log("Fetch success with answer : ", resData);
    }
    catch (error)
    {
        console.error("Error while fetching API");
    }
}

export function handleRegisterModal(params) {
    const dialog = document.getElementById("register-modal");
    const closeModalBtn = document.getElementById("close-register-modal");
    const submitBtn = document.getElementById("submit-register-btn");

    closeModalBtn?.addEventListener("click", () => {
        dialog?.close();
    })

    submitBtn?.addEventListener("click", () => {
        console.log("You submited register form");
        submitForm();
    })

    //Handle register modal closing when clicking outside the modal.
    const registerModal = document.getElementById("register-modal");
    window.onclick = function (event) {
        if (event.target === registerModal)
            registerModal.close();
        }
}
