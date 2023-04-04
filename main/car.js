if (localStorage.getItem("user_id") !== null) {
	document.querySelector("#login-btn .btn").style.display = "none";
	const addCarLink = document.createElement("a");
	addCarLink.href = "addCar.html";
	addCarLink.textContent = "Post";
	document.querySelector(".navbar").appendChild(addCarLink);
}
const carId = localStorage.getItem("car_id");
let car;

fetch("http://localhost:8080/api/cars/get-car-by-id", {
	headers: { "Content-Type": "application/json" },
	method: "POST",
	body: JSON.stringify({ carId: carId }),
})
	.then((response) => response.json())
	.then((data) => {
		if (data.length > 0) {
			car = data[0];
		}
		setCar();
	})
	.catch((err) => {
		console.log(err);
	});

const setCar = () => {
	const result = document.querySelector("#card");
	const date = new Date(+car.postDate);
	result.innerHTML += `
	<div class="card" data-value="${+carId}">
	<div class="head">
	<div class="images">
	
	${car.images.split("|").map((image) => "<img src='./photos/" + image + "' />")}
        			</div>
				</div>
				<div class="body">
					<div class="title">
            			<h1>${car.brand} ${car.model}</h1>
					</div>
					<div class="moreInfo">
						<p>Price: $${car.price}</p>
						<p>Seller Name: ${car.sellerName}</p>
						<p>Power: ${car.power}Hp</p>
						<p>Mileage: ${car.mileage} KM</p>
						<p>Region: ${car.region}</p>
						<p>Gas Type: ${car.gasType}</p>
						<p>${car.isRegistered === 1 ? "Registration: " + car.registration : ""}</p>
						<p>${car.message === undefined ? "" : "Message: " + car.message}</p>					
						<p>Telephone: ${car.phone}</p>
						<small>Posted on: ${date.getDate() + 1}/${
		date.getMonth() + 1
	}/${date.getFullYear()}</small>
						</div>
				</div>
    		</div>
		`;
};
