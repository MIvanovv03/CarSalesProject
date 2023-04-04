require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { authRoute, carsRoute } = require("./routes");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", authRoute);
app.use("/api/cars", carsRoute);

module.exports = app;
