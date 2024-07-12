CREATE TABLE user_schema.users (
    id uuid PRIMARY KEY,
    first_name text,
    last_name text,
    email text,
    password text,
    birth_date date,
    password_hash text,
    password_salt text
);