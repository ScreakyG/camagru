export function handleHeader() {
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");

    registerBtn?.addEventListener("click", () => {
        console.log("You clicked register button");
    })

    loginBtn?.addEventListener("click", () => {
        console.log("You clicked login button");
    })
}
