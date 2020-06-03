BEGIN TRANSACTION;

CREATE TABLE payments (
    id serial PRIMARY KEY,
    payee_id VARCHAR(100),
    payer_id VARCHAR(100),
    payment_system VARCHAR(100),
    payment_method VARCHAR(100),
    amount NUMERIC(18,2),
    currency VARCHAR(3),
    status VARCHAR(10),
    comment VARCHAR(100),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);

COMMIT;


