const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const { MYSQL_USER } = process.env;
const { MYSQL_PASS } = process.env;
const { MYSQL_DATABASE } = process.env;
const { MYSQL_USERS } = process.env;

const mysqlConnection = mysql.createConnection({
	host: "localhost",
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: MYSQL_DATABASE,
	multipleStatements: true,
});

router.post("/signup", [], (req, res) => {
	mysqlConnection.query(
		`INSERT INTO ${MYSQL_USERS} (email , password, name)
	    VALUES ("${req.body.email}" , "${req.body.password}" , "${req.body.name}" ); Select LAST_INSERT_ID();`,
		function (error, results) {
			if (error) {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({
						message: error.message,
					})
					.end();
			}
			const id = Object.values(results[1][0]).map((value) => {
				return value;
			});
			res.status(200).json({ id: id[0] }).end();
		}
	);
});

router.post("/signin", (request, response) => {
	mysqlConnection.connect((err) => {
		if (err) {
			console.log(err);
		}

		mysqlConnection.query(
			`SELECT id FROM users WHERE email = "${request.body.email}" AND password = "${request.body.password}";`,
			function (error, results) {
				if (error) {
					console.log(error);
				}

				if (results.length == 0) {
					response
						.status(StatusCodes.BAD_REQUEST)
						.json({
							message: "Няма такъв потребител с такъв email и парола ! ",
						})
						.end();
				} else {
					response.status(StatusCodes.OK).json({ id: results[0].id });
					response.end();
				}
				response.end();
			}
		);
	});
});

module.exports = router;
