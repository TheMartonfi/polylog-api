const router = require("express").Router();
const { parseQuizCards } = require("./helpers");

module.exports = db => {
	router.get("/", (req, res) => {
		db.query(
			`
      SELECT
        quiz_questions.quiz_card_id,
        quiz_answers.quiz_question_id,
        quiz_answers.id AS quiz_answer_id,
        quiz_cards.title,
        quiz_questions.question,
        quiz_answers.answer,
        quiz_answers.correct,
        quiz_cards.position
      FROM quiz_cards
      JOIN quiz_questions ON quiz_cards.id = quiz_questions.quiz_card_id
      JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_question_id
      WHERE quiz_cards.lecture_id = $1::integer
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1]
		).then(({ rows: cards }) => res.json(parseQuizCards(cards)));
	});

	router.get("/responses", (req, res) => {
		db.query(
			`
      SELECT
        quiz_responses.student_id,
        quiz_responses.quiz_card_id,
        quiz_answers.id AS quiz_answer_id,
        quiz_answers.correct
      FROM quiz_responses
      JOIN quiz_answers ON quiz_answers.id = quiz_responses.quiz_answer_id
      JOIN quiz_questions ON quiz_questions.id = quiz_answers.quiz_question_id
      WHERE quiz_responses.quiz_card_id = $1::integer
      AND quiz_responses.session_id = $2::uuid
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "4a115ab1-c845-412a-b868-531cf505bf45"]
		).then(({ rows: responses }) => res.json(responses));
	});

	router.post("/card", (req, res) => {
		db.query(
			`
      INSERT INTO quiz_cards (
        lecture_id,
        title,
        position
      )
      
      VALUES ($1::integer, $2::text, $3::integer)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: card }) => res.json(card));
	});

	router.post("/question", (req, res) => {
		db.query(
			`
      INSERT INTO quiz_questions (
        quiz_card_id,
        question
      )
      
      VALUES ($1::integer, $2::text)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: question }) => res.json(question));
	});

	router.post("/answer", (req, res) => {
		db.query(
			`
      INSERT INTO quiz_answers (
        quiz_question_id,
        answer,
        correct
      )
      
      VALUES ($1::integer, $2::text, $3::boolean)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: answer }) => res.json(answer));
	});

	router.post("/response", (req, res) => {
		db.query(
			`
      INSERT INTO quiz_responses (
        quiz_card_id,
        quiz_answer_id,
        session_id,
        student_id
      )
      
      VALUES ($1::integer, $2::integer, $3::uuid, $4::integer)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: response }) => res.json(response));
	});

	router.put("/card", (req, res) => {
		db.query(
			`
      UPDATE quiz_cards
      SET title = $1::text, position = $2::integer
      WHERE quiz_cards.id = $3::integer

      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: card }) => res.json(card));
	});

	router.put("/question", (req, res) => {
		db.query(
			`
      UPDATE quiz_questions
      SET question = $1::text
      WHERE quiz_questions.quiz_card_id = $2::integer

      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: question }) => res.json(question));
	});

	router.put("/answer", (req, res) => {
		db.query(
			`
      UPDATE quiz_answers
      SET answer = $1::text, correct = $2::boolean
      WHERE quiz_answers.quiz_question_id = $3::integer

      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: answer }) => res.json(answer));
	});

	router.delete("/", (req, res) => {
		db.query(
			`
      DELETE FROM quiz_cards
      WHERE quiz_cards.id = $1::integer
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: card }) => res.json(card));
	});

	return router;
};
