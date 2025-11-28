require('dotenv').config();
const pool = require('./db');

async function updateSchema() {
    try {
        console.log('Updating schema...');

        // Add new columns
        await pool.query(`
      ALTER TABLE inquiries 
      ADD COLUMN IF NOT EXISTS company VARCHAR(255),
      ADD COLUMN IF NOT EXISTS budget VARCHAR(100),
      ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
      ADD COLUMN IF NOT EXISTS source VARCHAR(100),
      ADD COLUMN IF NOT EXISTS target_audience TEXT,
      ADD COLUMN IF NOT EXISTS key_features TEXT;
    `);
        console.log('Added new columns.');

        // Drop existing_url column
        await pool.query(`
      ALTER TABLE inquiries 
      DROP COLUMN IF EXISTS existing_url;
    `);
        console.log('Dropped existing_url column.');

        console.log('Schema update completed successfully!');
    } catch (error) {
        console.error('Schema update error:', error);
    } finally {
        await pool.end();
    }
}

updateSchema();
