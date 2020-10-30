DROP TABLE IF EXISTS lectures CASCADE;

CREATE TABLE lectures (
  id SERIAL PRIMARY KEY NOT NULL,
  lecturer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT DEFAULT 'No description'
);