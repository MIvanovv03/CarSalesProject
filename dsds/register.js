import validateLoginRequest from "./utils.js";
import { REGISTER_TYPE } from "./constants.js";

document.querySelector(".btn.register").addEventListener("click", (e) => {
	e.preventDefault();
	const email = document.querySelector("#registerForm .email").value;
	const password = document.querySelector("#registerForm .password").value;
	const username = document.querySelector("#registerForm .username").value;

	const data = {
		email: email,
		password: password,
		username: username,
	};

	const validationResponse = validateLoginRequest({
		email: email,
		password: password,
		username: username,
		type: REGISTER_TYPE,
	});

	if (!validationResponse.validate) {
		document.getElementById("error").innerHTML = validationResponse.message;
		setTimeout(() => {
			document.getElementById("error").innerHTML = "";
		}, 3000);
	} else {
		fetch("http://localhost:8080/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status !== 200 && data.id === undefined) {
					if (data.message === undefined) {
						document.getElementById("error").innerHTML = "Unhandled error!";
						setTimeout(() => {
							document.getElementById("error").innerHTML = "";
						}, 5000);
					} else {
						document.getElementById("error").innerHTML = data.message;
						setTimeout(() => {
							document.getElementById("error").innerHTML = "";
						}, 5000);
					}
				} else {
					localStorage.setItem("user_id", data.id);
					document.querySelector("#login-btn .btn").style.display = "none";
					document
						.querySelector(".login-form-container")
						.classList.remove("active");
					document.querySelector("#register-form").style.display = "none";
					document.querySelector(".login-form-container form").style.display =
						"block";
				}
			})
			.catch((err) => {
				document.getElementById("error").innerHTML = err.message;

				setTimeout(() => {
					document.getElementById("error").innerHTML = "";
				}, 5000);
			});
	}
});
