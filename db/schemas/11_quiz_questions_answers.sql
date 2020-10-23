DROP TABLE IF EXISTS quiz_questions_answers CASCADE;

CREATE TABLE quiz_questions_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_card_id INTEGER REFERENCES quiz_cards(id) ON DELETE CASCADE,
  quiz_question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
  quiz_answer_id INTEGER REFERENCES quiz_answers(id) ON DELETE CASCADE
);