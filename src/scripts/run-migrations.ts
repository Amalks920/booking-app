import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from '../config/database';

dotenv.config();

async function resolveMigrationsDir(): Promise<string> {
  const candidates = [
    path.resolve(process.cwd(), 'src/config/migrations'),
    path.resolve(process.cwd(), 'dist/config/migrations')
  ];

  for (const dir of candidates) {
    try {
      await fs.access(dir);
      return dir;
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error('No migrations directory found.');
}

async function ensureMigrationsTable(): Promise<void> {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const [rows] = await sequelize.query(
    'SELECT filename FROM schema_migrations ORDER BY filename ASC;'
  );

  const applied = new Set<string>();
  if (Array.isArray(rows)) {
    for (const row of rows as Array<{ filename: string }>) {
      applied.add(row.filename);
    }
  }

  return applied;
}

async function runMigrations(): Promise<void> {
  const migrationsDir = await resolveMigrationsDir();
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  await sequelize.authenticate();
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  for (const filename of files) {
    if (applied.has(filename)) {
      continue;
    }

    const filePath = path.join(migrationsDir, filename);
    const sql = await fs.readFile(filePath, 'utf8');

    console.log(`➡️ Applying migration: ${filename}`);
    await sequelize.transaction(async (transaction) => {
      await sequelize.query(sql, { transaction });
      await sequelize.query(
        'INSERT INTO schema_migrations (filename) VALUES (:filename);',
        {
          replacements: { filename },
          transaction
        }
      );
    });
    console.log(`✅ Applied: ${filename}`);
  }

  console.log('🎉 All migrations are up to date.');
  await sequelize.close();
}

runMigrations().catch((error) => {
  console.error('❌ Migration failed:', error);
  sequelize.close().finally(() => process.exit(1));
});

