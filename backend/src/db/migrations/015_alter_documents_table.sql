-- Migration 015: Alter documents table to allow integer user IDs and non-UUID relation IDs
ALTER TABLE documents ALTER COLUMN owner_id TYPE VARCHAR(255) USING owner_id::text;
ALTER TABLE documents ALTER COLUMN relation_id TYPE VARCHAR(255) USING relation_id::text;
