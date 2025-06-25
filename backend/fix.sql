ALTER TABLE tasks
ALTER COLUMN category_id TYPE INTEGER USING category_id::integer;