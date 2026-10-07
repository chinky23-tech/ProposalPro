CREATE TABLE IF NOT EXISTS billing (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    plan VARCHAR(100) NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    currency VARCHAR(10) NOT NULL DEFAULT 'USD',

    status VARCHAR(30) NOT NULL DEFAULT 'Pending',

    payment_method VARCHAR(100),

    billing_date DATE,

    next_billing_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);