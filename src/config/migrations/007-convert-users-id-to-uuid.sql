-- Migration: 007-convert-users-id-to-uuid.sql
-- Description: Convert users.id and user_profiles.user_id to UUID safely

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users'
      AND column_name = 'id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS id_uuid UUID DEFAULT gen_random_uuid();
    UPDATE users SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;

    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id_uuid UUID;
    UPDATE user_profiles up
    SET user_id_uuid = u.id_uuid
    FROM users u
    WHERE up.user_id IS NOT NULL
      AND up.user_id::text = u.id::text;

    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;

    ALTER TABLE user_profiles DROP COLUMN IF EXISTS user_id;
    ALTER TABLE users DROP COLUMN IF EXISTS id;

    ALTER TABLE users RENAME COLUMN id_uuid TO id;
    ALTER TABLE user_profiles RENAME COLUMN user_id_uuid TO user_id;

    ALTER TABLE users ADD PRIMARY KEY (id);
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_profiles'
      AND column_name = 'id'
      AND data_type <> 'uuid'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS id_uuid UUID DEFAULT gen_random_uuid();
    UPDATE user_profiles SET id_uuid = gen_random_uuid() WHERE id_uuid IS NULL;

    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
    ALTER TABLE user_profiles DROP COLUMN IF EXISTS id;
    ALTER TABLE user_profiles RENAME COLUMN id_uuid TO id;
    ALTER TABLE user_profiles ADD PRIMARY KEY (id);
  END IF;
END $$;

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

