const formLogin = document.querySelector("#formLogin");
const loginButton = document.getElementById("login");

formLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(formLogin);
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.message || data.error) {
            alert("Erreur dans l'identifiant ou le mot de passe");
        } else {
            sessionStorage.setItem("Token", data.token);
            window.location.replace("index.html");
        }
    });
});










