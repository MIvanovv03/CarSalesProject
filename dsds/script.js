let menu = document.querySelector("#menu-btn");
let navbar = document.querySelector(".navbar");
const formContainer = document.querySelector(".form-container");
let cars = [];
// --------------Print three cars --------------------------------
fetch("http://localhost:8080/api/cars/get-cars", {
	headers: { "Content-Type": "application/json" },
})
	.then((response) => response.json())
	.then((data) => {
		if (data.length > 0) {
			cars = data;
		}
		setCarsInIndex();
	})
	.catch((err) => {
		console.log(err);
	});

if (localStorage.getItem("user_id") !== null) {
	document.querySelector("#login-btn .btn").style.display = "none";
	document.querySelector(".login-form-container").classList.remove("active");
	registerForm && (registerForm.style.display = "none");
	document.querySelector(".login-form-container form").style.display = "block";
	const addCarLink = document.createElement("a");
	addCarLink.href = "addCar.html";
	addCarLink.textContent = "Post";
	document.querySelector(".navbar").appendChild(addCarLink);
}

menu.onclick = () => {
	menu.classList.toggle("fa-times");
	navbar.classList.toggle("active");
};
document.querySelector("#login-btn").onclick = () => {
	document.querySelector(".login-form-container").classList.toggle("active");
};
document.querySelector("#create-account").onclick = () => {
	document.querySelector(".login-form-container form").style.display = "none";
	document.querySelector("#registerForm").style.display = "block";
};
document.querySelector("#close-login-form").onclick = () => {
	document.querySelector(".login-form-container").classList.remove("active");
	document.querySelector("#registerForm").style.display = "none";
	document.querySelector(".login-form-container form").style.display = "block";
};
window.onscroll = () => {
	menu.classList.remove("fa-times");
	navbar.classList.remove("active");

	if (window.scrollY > 0) {
		document.querySelector(".header").classList.add("active");
	} else {
		document.querySelector(".header").classList.remove("active");
	}
};
document.querySelector(".home").onmousemove = (e) => {
	document.querySelectorAll(".home-parallax").forEach((elm) => {
		let speed = elm.getAttribute("data-speed");

		let x = (window.innerWidth - e.pageX * speed) / 90;
		let y = (window.innerHeight - e.pageY * speed) / 90;

		elm.style.transform = `translateX(${y}px) translateY(${x}px)`;
	});
};
document.querySelector(".home").onmouseleave = (e) => {
	document.querySelectorAll(".home-parallax").forEach((elm) => {
		elm.style.transform = `translateX(0px) translateY(0px)`;
	});
};

const setCarsInIndex = () => {
	const result = document.querySelector("#cars");
	const carsToRender = cars.slice(0, 3);
	carsToRender.map((car) => {
		result.innerHTML += `
			 <div class="card" data-value="${car.carId}">
        	<div class="image">
                	<img alt="cars" src="./photos/${car.images.split("|")[0]}">
        	</div>
        	<div class="title">
            	<h1>${car.brand} ${car.model}</h1>
        	</div>
        	<div class="des">
            	<h1>$ ${car.price}</h1>
        	</div>
    	</div>
		`;
	});

	document.querySelectorAll(".card").forEach((card) => {
		card.addEventListener("click", (e) => {
			let element = e.target.parentElement;
			if (element.getAttribute("data-value")) {
				localStorage.setItem("car_id", element.getAttribute("data-value"));
				window.location.href = "./car.html";
			} else {
				element = element.parentElement;
				localStorage.setItem("car_id", element.getAttribute("data-value"));
				window.location.href = "./car.html";
			}
		});
	});
};
