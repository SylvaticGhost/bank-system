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

CREATE TABLE account_schema.accounts (
    id uuid PRIMARY KEY,
    owner_id uuid,
    created_at timestamp,
    currency text,
    type text,
    tag text,
    is_closed boolean,
    FOREIGN KEY (owner_id) REFERENCES user_schema.users(id)
);

CREATE TABLE account_schema.operations (
    transaction_id uuid,
    account_id uuid,
    partner_id uuid,
    amount numeric,
    currency text,
    time timestamp,
    type text,
    comment text,
    PRIMARY KEY (transaction_id, account_id),
    FOREIGN KEY (account_id) REFERENCES account_schema.accounts(id),
    FOREIGN KEY (partner_id) REFERENCES account_schema.accounts(id)
);

CREATE INDEX operations_account_id_idx ON account_schema.operations(account_id);