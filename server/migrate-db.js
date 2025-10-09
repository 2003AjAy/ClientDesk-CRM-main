require('dotenv').config();
const pool = require('./db');

async function migrateDatabase() {
  try {
    // Create inquiries table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        project_type VARCHAR(255) NOT NULL,
        requirements TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Pending'
      )
    `);

    // Create project_timeline table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_timeline (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'developer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

migrateDatabase(); 