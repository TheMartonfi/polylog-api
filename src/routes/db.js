const router = require("express").Router();
const { runSchemaFiles, runSeedFiles } = require("../db/helpers");

module.exports = db => {
	router.get("/create", (req, res) => {
		runSchemaFiles(db)
			.then(() => res.status(200).send("Created Database Tables"))
			.catch(err => console.log(err));
	});

	router.get("/reset", (req, res) => {
		runSchemaFiles(db)
			.then(() => {
				runSeedFiles(db)
					.then(() => res.status(200).send("Database Reset"))
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	});

	return router;
};
