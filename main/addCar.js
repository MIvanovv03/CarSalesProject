if (localStorage.getItem("user_id") !== null) {
	document.querySelector("#login-btn .btn").style.display = "none";
	const addCarLink = document.createElement("a");
	addCarLink.href = "addCar.html";
	addCarLink.textContent = "Post";
	document.querySelector(".navbar").appendChild(addCarLink);
} else {
	history.back();
}
const form = document.querySelector("#addCarForm");
let isRegistered = document.querySelector(".box.isRegistered");
const filesInput = document.querySelector(".box.photos");
const data = {
	brand: "",
	model: "",
	isRegistered: false,
	registrationNumber: "",
	userId: +localStorage.getItem("user_id"),
	region: "",
	sellerName: "",
	price: "",
	year: null,
	telephone: null,
	gasType: "",
	mileage: null,
	message: "",
	power: null,
	otherData: [],
	images: [],
};
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const inputs = document.querySelectorAll(".box");
	const imageNames = [];
	inputs.forEach((input) => {
		if (input.classList[1] !== "photos") {
			data[input.classList[1]] = input.value;
		}
	});
	if (data.images.length > 1) {
		data.images.map((image) => {
			imageNames.push(image.name);
			document.querySelector(
				"#result"
			).innerHTML = `<a style="display: none" href="${image.url}" download>Download image</a>`;
			document.querySelector("#result a").click();
		});
	} else {
		imageNames.push(data.images[0].name);
		document.querySelector(
			"#result"
		).innerHTML = `<a style="display:none" href="${data.images[0].url}" download>Download image</a>`;
		document.querySelector("#result a").click();
	}

	data.images = imageNames;
	fetch("http://localhost:8080/api/cars/set-new-car", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	}).catch((error) => {
		console.error(error);
	});
});

filesInput.addEventListener("change", (event) => {
	if (event.target.files.length > 0) {
		const filesArray = [];
		Object.values(event.target.files).forEach((file) => {
			const url = URL.createObjectURL(file);
			filesArray.push({
				url: url,
				name: url
					.replace("blob:http://127.0.0.1:5500/", "")
					.concat("." + file.name.split(".")[1]),
			});
		});
		data.images = filesArray;
	} else {
		const url = URL.createObjectURL(event.target.files[0]);
		data.files = url;
	}
});
const registrationControl = document.querySelector("#registrationNumber");
isRegistered.addEventListener("change", (event) => {
	if (event.target.checked) {
		registrationControl.innerHTML += `
						<input type="text" placeholder="Registration Number" class="box registrationNumber" maxLength="8" />
					`;
	} else {
		registrationControl.innerHTML = "";
	}
});
