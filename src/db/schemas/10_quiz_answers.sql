DROP TABLE IF EXISTS quiz_answers CASCADE;

CREATE TABLE quiz_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer VARCHAR(255),
  correct BOOLEAN DEFAULT FALSE
);