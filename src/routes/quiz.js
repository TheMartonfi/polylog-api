const router = require("express").Router();
const { parseQuizCards } = require("./helpers");

module.exports = db => {
	router.get("/cards", (req, res) => {
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
      WHERE quiz_cards.lecture_id = $1
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			["4f7f1639-95b5-4950-b5f2-93d8159c0253"]
		).then(({ rows: cards }) => res.json(parseQuizCards(cards)));
	});

	router.get("/responses", (req, res) => {
		db.query(
			`
      SELECT
        quiz_responses.student_id,
        quiz_questions.question,
        quiz_answers.answer,
        quiz_answers.correct
      FROM quiz_responses
      JOIN quiz_answers ON quiz_answers.id = quiz_responses.quiz_answer_id
      JOIN quiz_questions ON quiz_questions.id = quiz_answers.quiz_question_id
      WHERE quiz_responses.quiz_card_id = $1
      AND quiz_responses.session_id = $2
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[1, "92a8b77c-ad8e-446b-8ddf-f1fe4ff8f854"]
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
      
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
			// When the front end makes a request make it send a response that gives me the conditions
			[]
		).then(({ rows: card }) => res.json(card));
	});

	return router;
};
