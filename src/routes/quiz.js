const router = require("express").Router();
const { parseQuizCards } = require("./helpers");
const {
	newQuizCard,
	newQuizQuestion,
	newQuizAnswer,
	newQuizResponse
} = require("../ws");

module.exports = db => {
	router.get("/card/:id", (req, res) => {
		db.query(
			`
      SELECT
        quiz_cards.id,
        quiz_questions.id AS quiz_question_id,
        quiz_answers.id AS quiz_answer_id,
        quiz_cards.title,
        quiz_questions.question,
        quiz_answers.answer,
        quiz_answers.correct,
        quiz_cards.position
      FROM quiz_cards
      LEFT JOIN quiz_questions ON quiz_cards.id = quiz_questions.quiz_card_id
      LEFT JOIN quiz_answers ON quiz_questions.id = quiz_answers.quiz_question_id
      WHERE quiz_cards.lecture_id = $1::integer
    `,
			[req.params.id]
		).then(({ rows: cards }) => res.json(parseQuizCards(cards)));
	});

	router.get("/responses/:id", (req, res) => {
		db.query(
			`
			SELECT
				quiz_responses.id,
        quiz_responses.student_id,
        quiz_answers.id AS quiz_answer_id
      FROM quiz_responses
      JOIN quiz_answers ON quiz_answers.id = quiz_responses.quiz_answer_id
      JOIN quiz_questions ON quiz_questions.id = quiz_answers.quiz_question_id
      WHERE quiz_responses.quiz_card_id = $1::integer
      AND quiz_responses.session_id = $2::uuid
    `,
			[req.params.id, req.query.session_id]
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
			RETURNING
				quiz_cards.id,
				quiz_cards.lecture_id,
				quiz_cards.title,
				quiz_cards.position;
    `,
			[req.body.lecture_id, req.body.title, req.body.position]
		).then(({ rows: cards }) => {
			const [card] = cards;
			newQuizCard(card.id, card.lecture_id, card.title, card.position);
			res.json(card);
		});
	});

	router.post("/question", (req, res) => {
		db.query(
			`
      INSERT INTO quiz_questions (
        quiz_card_id,
        question
      )
      
      VALUES ($1::integer, $2::text)
			RETURNING
				quiz_questions.quiz_card_id,
				quiz_questions.id,
				quiz_questions.question;
    `,
			[req.body.quiz_card_id, req.body.question]
		).then(({ rows: questions }) => {
			const [question] = questions;
			newQuizQuestion(question.quiz_card_id, question.id, question.question);
			res.json(question);
		});
	});

	router.post("/answer", (req, res) => {
		db.query(
			`
			WITH inserted AS (
				INSERT INTO quiz_answers (
					quiz_question_id,
					answer,
					correct
					)
					
				VALUES ($1::integer, $2::text, $3::boolean)
				RETURNING
					quiz_answers.id,
					quiz_answers.quiz_question_id,
					quiz_answers.answer,
					quiz_answers.correct
			)
			
			SELECT
				quiz_questions.quiz_card_id,
				inserted.quiz_question_id,
				inserted.id,
				inserted.answer,
				inserted.correct
			FROM inserted
			JOIN quiz_questions ON quiz_questions.id = inserted.quiz_question_id
			LIMIT 1;
    `,
			[req.body.quiz_question_id, req.body.answer, req.body.correct]
		).then(({ rows: answers }) => {
			const [answer] = answers;
			newQuizAnswer(
				answer.quiz_card_id,
				answer.quiz_question_id,
				answer.id,
				answer.answer,
				answer.correct
			);
			res.json(answer);
		});
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
			RETURNING
				quiz_responses.id,
				quiz_responses.quiz_answer_id,
				quiz_responses.student_id
    `,
			[
				req.body.quiz_card_id,
				req.body.quiz_answer_id,
				req.body.session_id,
				req.body.student_id
			]
		).then(({ rows: responses }) => {
			const [response] = responses;
			newQuizResponse(
				response.quiz_card_id,
				response.student_id,
				response.quiz_answer_id
			);
			res.json(response);
		});
	});

	router.put("/card/:id", (req, res) => {
		db.query(
			`
      UPDATE quiz_cards
      SET title = $1::text, position = $2::integer
      WHERE quiz_cards.id = $3::integer
			RETURNING
				quiz_cards.id,
				quiz_cards.title,
				quiz_cards.position;
    `,
			[req.body.title, req.body.position, req.params.id]
		).then(({ rows: cards }) => {
			const [card] = cards;
			// newQuizCard(card.id, card.title, card.position);
			res.status(204).json({});
		});
	});

	router.put("/question/:id", (req, res) => {
		db.query(
			`
      UPDATE quiz_questions
      SET question = $1::text
      WHERE quiz_questions.id = $2::integer
			RETURNING
				quiz_questions.quiz_card_id,
				quiz_questions.id,
				quiz_questions.question;
    `,
			[req.body.question, req.params.id]
		).then(({ rows: questions }) => {
			const [question] = questions;
			// newQuizQuestion(question.quiz_card_id, question.id, question.question);
			res.json(question);
		});
	});

	router.put("/answer/:id", (req, res) => {
		db.query(
			`
			WITH updated AS (
				UPDATE quiz_answers
				SET answer = $1::text, correct = $2::boolean
				FROM (
					SELECT quiz_questions.quiz_card_id
					FROM quiz_answers
					JOIN quiz_questions ON quiz_questions.id = quiz_answers.quiz_question_id
				)
				AS quiz_questions
				WHERE quiz_answers.id = $3::integer
				RETURNING
					quiz_questions.quiz_card_id,
					quiz_answers.quiz_question_id,
					quiz_answers.answer,
					quiz_answers.correct
			)
			SELECT * FROM updated
			LIMIT 1;
    `,
			[req.body.answer, req.body.correct, req.params.id]
		).then(({ rows: answers }) => {
			const [answer] = answers;
			// newQuizAnswer(
			// 	answer.quiz_card_id,
			// 	answer.quiz_question_id,
			// 	answer.id,
			// 	answer.answer,
			// 	answer.correct
			// );
			res.json(answer);
		});
	});

	router.delete("/card/:id", (req, res) => {
		db.query(
			`
      DELETE FROM quiz_cards
      WHERE quiz_cards.id = $1::integer
      RETURNING quiz_cards.id;
    `,
			[req.params.id]
		).then(({ rows: cards }) => {
			const [card] = cards;
			// deleteQuizCard(card.id);
			res.status(204).json({});
		});
	});

	router.delete("/question/:id", (req, res) => {
		db.query(
			`
      DELETE FROM quiz_questions
      WHERE quiz_questions.id = $1::integer
      RETURNING *;
    `,
			[req.params.id]
		).then(({ rows: questions }) => {
			const [question] = questions;
			// deleteQuizQuestion(question.quiz_card_id, question.id);
			res.json(question);
		});
	});

	router.delete("/answer/:id", (req, res) => {
		db.query(
			`
			WITH deleted AS (
				DELETE FROM quiz_answers
				WHERE quiz_answers.id = $1::integer
				RETURNING quiz_answers.quiz_question_id, quiz_answers.id
			)
			
			SELECT
				quiz_questions.quiz_card_id,
				deleted.quiz_question_id,
				deleted.id
			FROM deleted
			JOIN quiz_questions ON quiz_questions.id = deleted.quiz_question_id
			LIMIT 1;
    `,
			[req.params.id]
		).then(({ rows: answers }) => {
			const [answer] = answers;
			// deleteQuizAnswer(
			// 	answer.quiz_card_id,
			// 	answer.quiz_question_id,
			// 	answer.id,
			// );
			res.json(answer);
		});
	});

	return router;
};
