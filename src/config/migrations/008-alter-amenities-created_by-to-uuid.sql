-- Migration to alter the 'created_by' column in the 'amenities' table to UUID.
-- This is to resolve casting issues when synchronizing with Sequelize.

ALTER TABLE "amenities"
ALTER COLUMN "created_by" TYPE UUID USING "created_by"::uuid;

ALTER TABLE "amenities"
ALTER COLUMN "updated_by" TYPE UUID USING "updated_by"::uuid;

-- Optionally, if you want to set a default value or add a foreign key constraint,
-- you would do it here. For now, we are just changing the type and using the existing data.

-- Example of adding a foreign key constraint (uncomment and modify as needed):
-- ALTER TABLE "amenities"
-- ADD CONSTRAINT "fk_amenities_created_by"
-- FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL;

