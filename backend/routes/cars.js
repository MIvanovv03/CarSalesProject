const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const { MYSQL_USER } = process.env;
const { MYSQL_PASS } = process.env;
const { MYSQL_DATABASE } = process.env;
const { MYSQL_CARS } = process.env;

const mysqlConnection = mysql.createConnection({
	host: "localhost",
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: MYSQL_DATABASE,
});
const upload = multer({ dest: "./photos" });

router.post("/set-new-car", (req, res) => {
	mysqlConnection.connect((err) => {
		if (err) {
			console.log(err);
		}
		const date = Date.now();
		const images = req.body.images.join("|");
		const isRegistered = req.body.isRegistered === "on" ? 0 : 1;
		mysqlConnection.query(
			`INSERT INTO ${MYSQL_DATABASE}.${MYSQL_CARS} (brand,model,isRegistered,registration,region,phone,seller_name,user_id,price,year,power,mileage,gasType, post_date,message,images)VALUES ("${req.body.brand}","${req.body.model}",${isRegistered}, "${req.body.registrationNumber}", "${req.body.region}", "${req.body.telephone}", "${req.body.sellerName}", ${req.body.userId}, ${req.body.price}, ${req.body.year} ,${req.body.power}, ${req.body.mileage}, "${req.body.gasType}", "${date}", "${req.body.message}", "${images}");`,
			function (error) {
				if (error) {
					console.log(error);
				}
				res.status(StatusCodes.OK).end();
			}
		);
	});
	res.end();
});

router.get("/get-cars", (_, res) => {
	mysqlConnection.connect((err) => {
		if (err) {
			console.log(err);
		}
	});
	mysqlConnection.query(
		`Select * from ${MYSQL_CARS};`,
		function (error, results) {
			const data = [];
			if (error) {
				console.log(error.message);
			}
			if (results) {
				if (results.length > 0) {
					results.map((result) => {
						data.push({
							carId: result.id,
							brand: result.brand,
							model: result.model,
							isRegistered: result.isRegistered,
							registration: result.registration,
							region: result.region,
							phone: result.phone,
							sellerName: result.seller_name,
							userId: result.user_id,
							price: result.price,
							year: result.year,
							power: result.power,
							mileage: result.mileage,
							gasType: result.gasType,
							postDate: result.post_date,
							images: result.images,
							message: result.message,
						});
					});
					res.status(200).json(data).end();
				}
			}
		}
	);
});

router.post("/get-car-by-id", (req, res) => {
	mysqlConnection.connect((err) => {
		if (err) {
			console.log(err.message);
		}
	});
	mysqlConnection.query(
		`Select * from ${MYSQL_CARS} where id = ${req.body.carId};`,
		function (error, results) {
			const data = [];
			if (error) {
				console.log(error.message);
			}
			if (results.length > 0) {
				results.map((result) => {
					data.push({
						brand: result.brand,
						model: result.model,
						isRegistered: result.isRegistered,
						registration: result.registration,
						region: result.region,
						phone: result.phone,
						sellerName: result.seller_name,
						price: result.price,
						year: result.year,
						power: result.power,
						mileage: result.mileage,
						gasType: result.gasType,
						postDate: result.post_date,
						images: result.images,
					});
				});
				res.status(200).json(data).end();
			}
		}
	);
});

module.exports = router;
