-- Seeder: 001-seed-users.sql
-- Description: Insert sample users for development and testing

INSERT INTO users (name, email, created_at, updated_at) VALUES
    ('John Doe', 'john.doe@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Jane Smith', 'jane.smith@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Bob Johnson', 'bob.johnson@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Alice Brown', 'alice.brown@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Charlie Wilson', 'charlie.wilson@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Verify the insertion
SELECT 'Users seeded successfully' as message, COUNT(*) as total_users FROM users; 