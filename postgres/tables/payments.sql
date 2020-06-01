BEGIN TRANSACTION;

CREATE TABLE payments (
    id serial PRIMARY KEY,
    payee_id VARCHAR(100),
    payer_id VARCHAR(100),
    payment_system VARCHAR(100),
    payment_method VARCHAR(100),
    amount VARCHAR(100),
    currency VARCHAR(100),
    status VARCHAR(100),
    comment VARCHAR(100),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);

COMMIT;


