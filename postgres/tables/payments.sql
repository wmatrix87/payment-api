BEGIN TRANSACTION;

CREATE TABLE payments (
    id serial PRIMARY KEY,
    payeeId VARCHAR(100),
    payerId VARCHAR(100),
    paymentSystem VARCHAR(100),
    paymentMethod VARCHAR(100),
    amount VARCHAR(100),
    currency VARCHAR(100),
    status VARCHAR(100),
    comment VARCHAR(100),
    created TIMESTAMP NOT NULL,
    updated TIMESTAMP NOT NULL
);

COMMIT;


