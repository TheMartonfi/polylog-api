DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id uuid DEFAULT uuid_generate_v4 (),
  lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  PRIMARY KEY (id)
);