DROP TABLE IF EXISTS poll_responses CASCADE;

CREATE TABLE poll_responses (
  id SERIAL PRIMARY KEY NOT NULL,
  poll_choice_id INTEGER REFERENCES poll_choices(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);