const fs = require("fs");
const db = require(".");

const runSchemaFiles = function () {
	const dbSchemas = `${__dirname}/schemas`;
	const schemaFilenames = fs.readdirSync(dbSchemas);
	let sql = "";
	for (const fn of schemaFilenames) {
		sql += fs.readFileSync(`${dbSchemas}/${fn}`, "utf8");
	}
	return db.query(sql);
};

const runSeedFiles = function () {
	const dbSeeds = `${__dirname}/seeds`;
	const seedFilenames = fs.readdirSync(dbSeeds);
	let sql = "";
	for (const fn of seedFilenames) {
		sql += fs.readFileSync(`${dbSeeds}/${fn}`, "utf8");
	}
	return db.query(sql);
};

module.exports = { runSchemaFiles, runSeedFiles };
