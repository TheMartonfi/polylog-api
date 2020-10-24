DROP TABLE IF EXISTS topic_cards CASCADE;

CREATE TABLE topic_cards (
  id SERIAL PRIMARY KEY NOT NULL,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT 'No description',
  position INTEGER NOT NULL
);