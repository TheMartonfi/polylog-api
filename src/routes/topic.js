const router = require("express").Router();
const { parseTopicResponses } = require("./helpers");
const {
	updateTopicCard,
	updateTopicResponse,
	updateTopicReaction
} = require("../ws");

module.exports = db => {
	router.get("/card/:id", (req, res) => {
		db.query(
			`
			SELECT
				topic_cards.id,
        topic_cards.title,
				topic_cards.description,
        topic_cards.position
			FROM topic_cards
      WHERE topic_cards.lecture_id = $1::integer
    `,
			[req.params.id]
		).then(({ rows: cards }) => res.json(cards));
	});

	router.get("/responses/:id", (req, res) => {
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
			JOIN topic_reactions ON
				topic_reactions.topic_card_id = topic_responses.topic_card_id
		  WHERE topic_responses.topic_card_id = $1::integer
		  AND topic_responses.session_id = $2::uuid
		  AND topic_reactions.session_id = $2::uuid
		`,
			[
				req.params.id,
				req.query.session_uuid || "4a115ab1-c845-412a-b868-531cf505bf45"
			]
		).then(({ rows: responses }) => res.json(parseTopicResponses(responses)));
	});

	router.post("/card", (req, res) => {
		console.log(req.body);
		db.query(
			`
        INSERT INTO topic_cards (
          lecture_id,
          title,
          description,
          position
        )

        VALUES ($1::integer, $2::text, $3::text, $4::integer)
        RETURNING topic_cards.id;
      `,
			[
				req.body.lecture_id,
				req.body.title,
				req.body.description,
				req.body.position
			]
		).then(({ rows: cards }) => {
			const [card] = cards;
			res.json(card);
		});
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
        
				VALUES ($1::integer, $2::uuid, $3::integer, $4::text, $5::text)
				RETURNING
					topic_responses.id,
					topic_responses.type,
					topic_responses.response;
      `,
			[
				req.body.topic_card_id,
				req.body.session_id,
				req.body.student_id,
				req.body.type,
				req.body.response
			]
		).then(({ rows: responses }) => {
			const [response] = responses;
			updateTopicResponse(
				response.id,
				response.topic_card_id,
				response.student_id,
				response.type,
				response.response
			);
			res.json(response);
		});
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
        
        VALUES ($1::integer, $2::uuid, $3::integer, $4::boolean)
				RETURNING
					topic_reactions.id,
					topic_reactions.student_id,
					topic_reactions.reaction;
      `,
			[
				req.body.topic_card_id,
				req.body.session_id,
				req.body.student_id,
				req.body.reaction
			]
		).then(({ rows: reactions }) => {
			const [reaction] = reactions;
			updateTopicReaction(
				reaction.id,
				reaction.topic_card_id,
				reaction.student_id,
				reaction.reaction
			);
			res.json(reaction);
		});
	});

	router.put("/card/:id", (req, res) => {
		db.query(
			`
        UPDATE topic_cards
        SET title = $1::text, description = $2::text, position = $3::integer
        WHERE topic_cards.id = $4::integer
        RETURNING *;
      `,
			[req.body.title, req.body.description, req.body.position, req.params.id]
		).then(({ rows: cards }) => {
			const [card] = cards;
			updateTopicCard(card.id, card.title, card.description, card.position);
			res.status(204).json({});
		});
	});

	router.delete("/card/:id", (req, res) => {
		db.query(
			`
        DELETE FROM topic_cards
        WHERE topic_cards.id = $1::integer
        RETURNING topic_cards.id;
      `,
			[req.params.id]
		).then(({ rows: cards }) => {
			const [card] = cards;
			updateTopicCard(card.id, null, null, null);
			res.status(204).json({});
		});
	});

	return router;
};
