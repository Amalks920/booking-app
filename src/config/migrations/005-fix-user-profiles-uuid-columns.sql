-- Migration: 005-fix-user-profiles-uuid-columns.sql
-- Description: Ensure user_profiles UUID columns use correct types

ALTER TABLE user_profiles
  DROP COLUMN IF EXISTS role_id,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS role_id UUID,
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS updated_by UUID;

COMMENT ON COLUMN user_profiles.role_id IS 'Optional foreign key to roles table';
COMMENT ON COLUMN user_profiles.created_by IS 'User id that created the profile';
COMMENT ON COLUMN user_profiles.updated_by IS 'User id that last updated the profile';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON user_profiles(role_id);

