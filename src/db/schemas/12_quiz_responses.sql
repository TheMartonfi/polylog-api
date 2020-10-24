DROP TABLE IF EXISTS quiz_responses CASCADE;

CREATE TABLE quiz_responses (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_answer_id INTEGER REFERENCES quiz_answers(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);