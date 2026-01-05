DROP TABLE IF EXISTS password_reset_token;
CREATE TABLE IF NOT EXISTS password_reset_token (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_password_reset_token_email ON password_reset_token(email);
