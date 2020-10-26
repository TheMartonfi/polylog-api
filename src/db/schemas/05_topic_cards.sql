DROP TABLE IF EXISTS topic_cards CASCADE;

CREATE TABLE topic_cards (
  id SERIAL PRIMARY KEY NOT NULL,
  lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT DEFAULT 'No description',
  position INTEGER
);