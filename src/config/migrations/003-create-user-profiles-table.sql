-- Migration: 003-create-user-profiles-table.sql
-- Description: Create user_profiles table with constraints and indexes

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    country_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_by UUID,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON user_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Add comment to table
COMMENT ON TABLE user_profiles IS 'Extended profile information for users';

-- Add comments to columns
COMMENT ON COLUMN user_profiles.id IS 'Unique identifier for the user profile';
COMMENT ON COLUMN user_profiles.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN user_profiles.role_id IS 'Optional foreign key to roles table';
COMMENT ON COLUMN user_profiles.first_name IS 'User first name';
COMMENT ON COLUMN user_profiles.last_name IS 'User last name';
COMMENT ON COLUMN user_profiles.email IS 'User email address';
COMMENT ON COLUMN user_profiles.country_code IS 'Phone country code';
COMMENT ON COLUMN user_profiles.phone_number IS 'User phone number';
COMMENT ON COLUMN user_profiles.created_by IS 'User id that created the profile';
COMMENT ON COLUMN user_profiles.updated_by IS 'User id that last updated the profile';
COMMENT ON COLUMN user_profiles.created_at IS 'Timestamp when the profile was created';
COMMENT ON COLUMN user_profiles.updated_at IS 'Timestamp when the profile was last updated';

