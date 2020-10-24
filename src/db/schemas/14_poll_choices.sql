DROP TABLE IF EXISTS poll_choices CASCADE;

CREATE TABLE poll_choices (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_card_id INTEGER REFERENCES poll_cards(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  choice VARCHAR(255) NOT NULL
);
  
