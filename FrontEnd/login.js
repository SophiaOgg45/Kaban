const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const submit = document.querySelector("#submitUserInfo");


const btnLogin = submit.addEventListener("click", (a) => {
    a.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        sessionStorage.setItem("Token", data.token);

        if (data.message || data.error) {
            alert("Erreur dans l'identifiant ou le mot de passe");
        } else {
            sessionStorage.setItem("isConnected", JSON.stringify(true));
            window.location.replace("index.html");
        }
    })
});
