DROP TABLE IF EXISTS poll_cards CASCADE;

CREATE TABLE poll_cards (
  id SERIAL PRIMARY KEY NOT NULL,
  lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
  question VARCHAR(255),
  position INTEGER
);