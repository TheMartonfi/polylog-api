DROP TABLE IF EXISTS quiz_responses CASCADE;

CREATE TABLE quiz_responses (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_card_id INTEGER REFERENCES quiz_cards(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  answer BOOLEAN NOT NULL
);