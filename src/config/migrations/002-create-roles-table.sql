-- Migration: 002-create-roles-table.sql
-- Description: Create roles table with constraints and indexes

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(100) NOT NULL CHECK (length(role) >= 2),
    code VARCHAR(20) NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9_]+$'),
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS idx_roles_role ON roles(role);

-- Add comment to table
COMMENT ON TABLE roles IS 'Role definitions for access control';

-- Add comments to columns
COMMENT ON COLUMN roles.id IS 'Unique identifier for the role';
COMMENT ON COLUMN roles.role IS 'Role display name';
COMMENT ON COLUMN roles.code IS 'Unique role code (uppercase, underscore)';
COMMENT ON COLUMN roles.created_by IS 'User id that created the role';
COMMENT ON COLUMN roles.updated_by IS 'User id that last updated the role';
COMMENT ON COLUMN roles.created_at IS 'Timestamp when the role was created';
COMMENT ON COLUMN roles.updated_at IS 'Timestamp when the role was last updated';

