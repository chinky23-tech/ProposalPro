CREATE TABLE workspace_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  company_logo VARCHAR(500),
  brand_color VARCHAR(10) DEFAULT '#10b981',
  default_currency VARCHAR(10) DEFAULT 'USD',
  tax_rate DECIMAL(5, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);