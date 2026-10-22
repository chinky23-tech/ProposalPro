-- Migration 014: Add missing columns to templates, clients, packages, and users

-- 1. Templates: Add category and updated_at
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General';

ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 2. Clients: Add address and updated_at
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS address VARCHAR(255);

ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. Packages: Add updated_at
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 4. Users: Add stripe_customer_id and updated_at
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
