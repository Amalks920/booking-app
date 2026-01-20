ALTER TABLE user_profiles
  ADD COLUMN role_id UUID NULL;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_role_id_fkey
  FOREIGN KEY (role_id) REFERENCES roles(id);

