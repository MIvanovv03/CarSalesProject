if (localStorage.getItem("user_id") !== null) {
	document.querySelector("#login-btn .btn").style.display = "none";
	const addCarLink = document.createElement("a");
	addCarLink.href = "addCar.html";
	addCarLink.textContent = "Post";
	document.querySelector(".navbar").appendChild(addCarLink);
}
const fields = document.querySelectorAll("select");
let cars = [];
let filteredCars = [];
const filters = {
	brand: ["Всички", "Audi", "Alfa", "Volvo", "Opel"],
	model: {
		all: "Всички",
		Audi: [
			"A1",
			"A2",
			"A3",
			"A4",
			"A5",
			"A6",
			"A7",
			"A8",
			"RS3",
			"RS4",
			"RS5",
			"RS6",
			"RS7",
		],
		Alfa: ["157", "147", "159"],
		Volvo: ["S40", "V40", "S60", "V60", "V80", "XC90", "S80", "XC60"],
		Opel: ["Astra", "Vectra", "Corsa"],
	},
	year: [
		"Всички",
		"Преди 2000",
		"2000-2005",
		"2005-2010",
		"2010-2015",
		"2015-2020",
		"След 2020",
	],
	region: [
		"Всички",
		"Пловдив",
		"София",
		"Варна",
		"Бургас",
		"Стара Загора",
		"Кюстендил",
		"Видин",
		"Перник",
		"Мездра",
		"Враца",
		"Плевен",
		"Горна Оряховица",
		"Хасково",
	],
	power: [
		"Всички",
		"Под 100",
		"100-150",
		"150-200",
		"200-250",
		"250-300",
		"300-350",
		"350-400",
		"Над 400",
	],
	price: [
		"Всички",
		"Под 1000",
		"1000-2000",
		"2000-3000",
		"3000-4000",
		"4000-5000",
		"5000-6000",
		"6000-7000",
		"7000-8000",
		"8000-9000",
		"9000-10000",
		"Над 10000",
	],
};
let chosenFilter = {
	brand: "Всички",
	model: "Всички",
	year: "Всички",
	price: "Всички",
	power: "Всички",
	region: "Всички",
};

const setFiltersInFields = () => {
	fields.forEach((field) => {
		const type = field.classList[1];
		const currentFilter = filters[type];
		if (type === "model") {
			field.innerHTML += `
                <option value="${currentFilter.all}">${currentFilter.all}</option>`;
			Object.values(currentFilter).forEach((value) => {
				if (typeof value !== "string") {
					value.map((model) => {
						field.innerHTML += `
                <option value="${model}">${model}</option>`;
					});
				}
			});
		} else {
			currentFilter.map((data) => {
				field.innerHTML += `
                <option value="${data}">${data}</option>`;
			});
		}
	});
};

const printCars = () => {
	const result = document.querySelector("#result");
	result.innerHTML = "";
	if (filteredCars.length == 0) {
		result.innerHTML = `<p class="noCars">No cars to show with these filters!</p>`;
	} else {
		filteredCars.map((car) => {
			result.innerHTML += `
                 <div class="card" data-value="${car.carId}">
                <div class="image">
                        <img alt="cars" src="./photos/${
													car.images.split("|")[0]
												}">
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
	}
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

fetch("http://localhost:8080/api/cars/get-cars", {
	headers: { "Content-Type": "application/json" },
})
	.then((response) => response.json())
	.then((data) => {
		if (data.length > 0) {
			cars = data;
			filteredCars = data;
		}
		setFiltersInFields();
		printCars();
	})
	.catch((err) => {
		console.log(err);
	});

fields.forEach((field) => {
	let carsToReturn = [];
	field.addEventListener("change", (e) => {
		const filterValue = e.target.value;
		const filter = e.target.classList[1];
		chosenFilter[filter] = filterValue;
		carsToReturn = [];
		filteredCars = cars;
		let condition = "true";
		Object.keys(chosenFilter).forEach((filterKey) => {
			switch (filterKey) {
				case "brand":
					if (chosenFilter[filterKey] !== "Всички") {
						if (condition === "true") {
							condition = `car.brand === "${chosenFilter[filterKey]}"`;
						} else if (chosenFilter[filterKey] !== "Всички") {
							const array = condition.split("&&");
							array.push(`car.brand === "${chosenFilter[filterKey]}"`);
							condition = array.join("&&");
						}
					}
					break;
				case "model":
					if (chosenFilter[filterKey] !== "Всички") {
						if (condition === "true") {
							condition = `car.model === "${chosenFilter[filterKey]}"`;
						} else if (chosenFilter[filterKey] !== "Всички") {
							const array = condition.split("&&");
							array.push(`car.model === "${chosenFilter[filterKey]}"`);
							console.log(array);
							condition = array.join("&&");
						}
					}
					break;
				case "year":
					console.log(chosenFilter[filterKey]);
					if (chosenFilter[filterKey] !== "Всички") {
						console.log("Entered");
						if (condition === "true") {
							if (chosenFilter[filterKey] === "Преди 2000") {
								condition = `car.year >= 2000`;
							} else if (chosenFilter[filterKey] === "След 2020") {
								condition = `car.year <= 2020`;
							} else {
								const years = chosenFilter[filterKey].split("-");
								condition = `car.year >= ${+years[0]} && car.year <= ${+years[1]}`;
							}
						} else {
							if (chosenFilter[filterKey] === "Преди 2000") {
								const array = condition.split("&&");
								array.push(`car.year >= 2000`);
								condition = array.join("&&");
							} else if (chosenFilter[filterKey] === "След 2020") {
								const array = condition.split("&&");
								array.push(`car.year <= 2020`);
								console.log(array);
								condition = array.join("&&");
							} else {
								const years = chosenFilter[filterKey].split("-");
								const array = condition.split("&&");
								array.push(
									`car.year >= ${+years[0]} && car.year <= ${+years[1]}`
								);
								condition = array.join("&&");
							}
						}
					}
					break;
				case "region":
					if (chosenFilter[filterKey] !== "Всички") {
						if (condition === "true") {
							condition = `car.region === "${chosenFilter[filterKey]}"`;
						} else if (chosenFilter[filterKey] !== "Всички") {
							const array = condition.split("&&");
							array.push(`car.region === "${chosenFilter[filterKey]}"`);
							condition = array.join("&&");
						}
					}
					break;
				case "power":
					if (chosenFilter[filterKey] !== "Всички") {
						console.log("Entered");
						if (condition === "true") {
							if (chosenFilter[filterKey] === "Под 100") {
								condition = `car.power <= 100`;
							} else if (chosenFilter[filterKey] === "Над 400") {
								condition = `car.power >= 400`;
							} else {
								const powers = chosenFilter[filterKey].split("-");
								condition = `car.power >= ${+powers[0]} && car.power <= ${+powers[1]}`;
							}
						} else {
							if (chosenFilter[filterKey] === "Под 100") {
								const array = condition.split("&&");
								array.push(`car.power <= 100`);
								condition = array.join("&&");
							} else if (chosenFilter[filterKey] === "Над 400") {
								const array = condition.split("&&");
								array.push(`car.power >= 400`);
								condition = array.join("&&");
							} else {
								const powers = chosenFilter[filterKey].split("-");
								const array = condition.split("&&");
								array.push(
									`car.power >= ${+powers[0]} && car.power <= ${+powers[1]}`
								);
								condition = array.join("&&");
							}
						}
					}
					break;
				case "price":
					if (chosenFilter[filterKey] !== "Всички") {
						if (condition === "true") {
							if (chosenFilter[filterKey] === "Под 1000") {
								condition = `car.price <= 1000`;
							} else if (chosenFilter[filterKey] === "Над 10000") {
								condition = `car.price >= 10000`;
							} else {
								const prices = chosenFilter[filterKey].split("-");
								condition = `car.price >= ${+prices[0]} && car.price <= ${+prices[1]}`;
							}
						} else {
							if (chosenFilter[filterKey] === "Под 1000") {
								const array = condition.split("&&");
								array.push(`car.price <= 1000`);
								condition = array.join("&&");
							} else if (chosenFilter[filterKey] === "Над 10000") {
								const array = condition.split("&&");
								array.push(`car.price >= 10000`);
								condition = array.join("&&");
							} else {
								const prices = chosenFilter[filterKey].split("-");
								const array = condition.split("&&");
								array.push(
									`car.price >= ${+prices[0]} && car.price <= ${+prices[1]}`
								);
								console.log(array);
								condition = array.join("&&");
							}
						}
					}
					break;
			}
		});
		filteredCars.map((car) => {
			console.log(condition);
			if (eval(condition) || condition === "true") {
				carsToReturn.push(car);
			}
		});
		filteredCars = carsToReturn;
		console.log(filteredCars);
		printCars();
	});
});
