const router = require("express").Router();
const { runSchemaFiles } = require("../../db/helpers");

module.exports = db => {
	router.get("/create", (req, res) => {
		runSchemaFiles(db)
			.then(() => res.status(200).send("Created Database Tables"))
			.catch(err => console.log(err));
	});

	return router;
};
