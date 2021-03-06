DROP TABLE IF EXISTS topic_reactions CASCADE;

CREATE TABLE topic_reactions (
  id SERIAL PRIMARY KEY NOT NULL,
  topic_card_id INTEGER REFERENCES topic_cards(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  reaction BOOLEAN NOT NULL
);