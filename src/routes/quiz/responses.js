const router = require("express").Router();

module.exports = db => {
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
	return router;
};
