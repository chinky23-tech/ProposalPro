CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'IMAGE', 'PDF', 'CONTRACT', etc.
    mime_type VARCHAR(100) NOT NULL, -- 'application/pdf', 'image/jpeg'
    file_size INT NOT NULL,
    owner_id UUID NOT NULL,
    relation_type VARCHAR(50), -- 'PROPOSAL', 'CLIENT', etc.
    relation_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);