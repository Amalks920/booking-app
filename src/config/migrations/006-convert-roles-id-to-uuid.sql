-- Migration: 006-convert-roles-id-to-uuid.sql
-- Description: Convert roles.id and user_profiles.role_id to UUID safely

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'roles'
      AND column_name = 'id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE roles ADD COLUMN IF NOT EXISTS id_uuid UUID DEFAULT gen_random_uuid();
    UPDATE roles SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;

    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role_id_uuid UUID;
    UPDATE user_profiles up
    SET role_id_uuid = r.id_uuid
    FROM roles r
    WHERE up.role_id IS NOT NULL
      AND up.role_id::text = r.id::text;

    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_id_fkey;
    ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_pkey;

    ALTER TABLE user_profiles DROP COLUMN IF EXISTS role_id;
    ALTER TABLE roles DROP COLUMN IF EXISTS id;

    ALTER TABLE roles RENAME COLUMN id_uuid TO id;
    ALTER TABLE user_profiles RENAME COLUMN role_id_uuid TO role_id;

    ALTER TABLE roles ADD PRIMARY KEY (id);
  END IF;
END $$;

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_role_id_fkey;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_role_id_fkey
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON user_profiles(role_id);

