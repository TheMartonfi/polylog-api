DROP TABLE IF EXISTS lectures CASCADE;

CREATE TABLE lectures (
  id UUID DEFAULT uuid_generate_v4 (),
  lecturer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT 'No description',
  PRIMARY KEY (id)
);