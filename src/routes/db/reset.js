const router = require("express").Router();
const { runSchemaFiles, runSeedFiles } = require("../../db/helpers");

module.exports = db => {
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
