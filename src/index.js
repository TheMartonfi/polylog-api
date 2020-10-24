require("dotenv").config();

const PORT = process.env.PORT || 3001;
const ENV = process.env.ENV || "development";
const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT} in ${ENV} mode`);
});

module.exports = app;
