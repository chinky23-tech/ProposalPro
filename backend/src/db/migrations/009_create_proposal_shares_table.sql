CREATE TABLE IF NOT EXISTS proposal_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id INT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE, -- Changed to INT
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proposal_shares_token ON proposal_shares(token);