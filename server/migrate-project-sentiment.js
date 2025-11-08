const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateProjectSentimentTable() {
  try {
    console.log('Creating project_sentiment table...');
    
    // Drop the old client_sentiment table if it exists
    await pool.query(`DROP TABLE IF EXISTS client_sentiment;`);
    
    // Create new project_sentiment table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_sentiment (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        sentiment_label VARCHAR(20) NOT NULL CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
        confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
        relationship_health_score INTEGER NOT NULL CHECK (relationship_health_score >= 0 AND relationship_health_score <= 100),
        summary TEXT NOT NULL,
        analysis_method VARCHAR(20) DEFAULT 'fallback' CHECK (analysis_method IN ('huggingface', 'fallback')),
        trend_history JSONB DEFAULT '[]'::jsonb,
        last_analyzed_message TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id)
      );
    `);

    console.log('✅ project_sentiment table created successfully');
    
    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_project_sentiment_project_id ON project_sentiment(project_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_project_sentiment_updated_at ON project_sentiment(updated_at);
    `);
    
    console.log('✅ Indexes created successfully');
    
  } catch (error) {
    console.error('❌ Error creating project_sentiment table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  migrateProjectSentimentTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateProjectSentimentTable };
