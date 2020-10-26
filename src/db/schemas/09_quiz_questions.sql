DROP TABLE IF EXISTS quiz_questions CASCADE;

CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_card_id INTEGER REFERENCES quiz_cards(id) ON DELETE CASCADE,
  question VARCHAR(255)
);