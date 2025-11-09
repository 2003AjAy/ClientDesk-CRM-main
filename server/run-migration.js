require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Read and execute the migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', '001_create_project_assignments.sql'),
      'utf8'
    );
    
    await client.query(migrationSQL);
    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error running migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
