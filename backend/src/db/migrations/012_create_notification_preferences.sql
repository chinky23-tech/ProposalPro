CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_proposal_opened BOOLEAN DEFAULT TRUE,
  email_proposal_accepted BOOLEAN DEFAULT TRUE,
  email_payment_received BOOLEAN DEFAULT TRUE,
  email_weekly_digest BOOLEAN DEFAULT FALSE,
  in_app_alerts BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);