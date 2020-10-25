const router = require("express").Router();
const { parseTopicResponses } = require("./helpers");

module.exports = db => {
	router.get("/cards", (req, res) => {
		db.query(
			`
			SELECT
				topic_cards.id,
        topic_cards.title,
				topic_cards.description,
        topic_cards.position
			FROM topic_cards
      WHERE topic_cards.lecture_id = $1
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			["4f7f1639-95b5-4950-b5f2-93d8159c0253"]
		).then(({ rows: cards }) => res.json(cards));
	});

	router.get("/responses", (req, res) => {
		db.query(
			`
      SELECT
      topic_responses.id AS topic_response_id,
      topic_responses.type,
      topic_responses.response,
      topic_reactions.student_id,
      topic_reactions.id AS topic_reaction_id,
      topic_reactions.reaction
      FROM topic_responses
      JOIN topic_reactions ON $1 = topic_reactions.topic_card_id
      WHERE topic_responses.topic_card_id = $1
      AND topic_responses.session_id = $2
      AND topic_reactions.session_id = $2
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "92a8b77c-ad8e-446b-8ddf-f1fe4ff8f854"]
		).then(({ rows: responses }) => res.json(parseTopicResponses(responses)));

		router.post("/card", (req, res) => {
			db.query(
				`
        INSERT INTO topic_cards (
          lecture_id,
          title,
          description,
          position
        )
        
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: card }) => res.json(card));
		});

		router.post("/response", (req, res) => {
			db.query(
				`
        INSERT INTO topic_responses (
          topic_card_id,
          session_id,
          student_id,
          type,
          response
        )
        
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: response }) => res.json(response));
		});

		router.post("/reaction", (req, res) => {
			db.query(
				`
        INSERT INTO topic_reactions (
          topic_card_id,
          session_id,
          student_id,
          reaction
        )
        
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: reaction }) => res.json(reaction));
		});

		router.put("/card", (req, res) => {
			db.query(
				`
        UPDATE topic_cards
        SET title = $1, description = $2, position = $3
        WHERE topic_cards.id = $4
        RETURNING *;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: card }) => res.json(card));
		});

		router.delete("/card", (req, res) => {
			db.query(
				`
        DELETE FROM topic_cards
        WHERE topic_cards.id = $1;
      `,
				// When the front end makes a request make it send a response that gives me the conditions
				[]
			).then(({ rows: card }) => res.json(card));
		});
	});

	return router;
};
