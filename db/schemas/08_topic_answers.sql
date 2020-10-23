DROP TABLE IF EXISTS topic_answers CASCADE;

CREATE TABLE topic_ansswers (
  id SERIAL PRIMARY KEY NOT NULL,
  topic_card_id INTEGER REFERENCES topic_cards(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL
);