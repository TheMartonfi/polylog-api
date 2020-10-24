const router = require("express").Router();
const { parseCards } = require("./helpers");

module.exports = db => {
	router.get("/cards", (req, res) => {
		db.query(
			`
      SELECT
        quiz_questions.quiz_card_id,
        quiz_answers.quiz_question_id,
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
		).then(({ rows: cards }) => res.json(parseCards(cards)));
	});
	return router;
};
