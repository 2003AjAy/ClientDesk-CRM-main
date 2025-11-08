const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateSentimentTable() {
  try {
    console.log('Creating client_sentiment table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS client_sentiment (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(255) NOT NULL,
        sentiment_label VARCHAR(20) NOT NULL CHECK (sentiment_label IN ('positive', 'neutral', 'negative')),
        confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
        relationship_health_score INTEGER NOT NULL CHECK (relationship_health_score >= 0 AND relationship_health_score <= 100),
        summary TEXT NOT NULL,
        trend_history JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id)
      );
    `);

    console.log('✅ client_sentiment table created successfully');
    
    // Create index for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_client_sentiment_client_id ON client_sentiment(client_id);
    `);
    
    console.log('✅ Index created successfully');
    
  } catch (error) {
    console.error('❌ Error creating client_sentiment table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  migrateSentimentTable()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateSentimentTable };
