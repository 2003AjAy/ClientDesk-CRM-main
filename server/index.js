require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db');
const developersRouter = require('./routes/developers');
const usersRouter = require('./routes/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());


// API Routes
app.use('/api/developers', developersRouter);
app.use('/api/users', usersRouter);

// Placeholder endpoint for form submissions
app.post('/api/submit', async (req, res) => {
  const { name, email, phone, company, projectType, budget, timeline, source, targetAudience, keyFeatures, requirements, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inquiries (name, email, phone, company, project_type, budget, timeline, source, target_audience, key_features, requirements, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [name, email, phone, company, projectType, budget, timeline, source, targetAudience, keyFeatures, requirements, date]
    );
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: result.rows[0] });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ message: 'Failed to submit inquiry' });
  }
});

// Fetch projects assigned to a specific developer
app.get('/api/projects/assigned/:developerId', async (req, res) => {
  const { developerId } = req.params;

  try {
    // First, check if the project_assignments table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'project_assignments'
      )`
    );

    if (!tableExists.rows[0].exists) {
      console.warn('project_assignments table does not exist. Returning empty array.');
      return res.json([]);
    }

    // Get all project IDs assigned to this developer
    const assignmentsResult = await pool.query(
      'SELECT project_id FROM project_assignments WHERE developer_id = $1',
      [developerId]
    );

    if (assignmentsResult.rows.length === 0) {
      return res.json([]);
    }

    const projectIds = assignmentsResult.rows.map(row => row.project_id);

    // Then get the full project details for these projects
    const result = await pool.query(
      `SELECT * FROM inquiries 
       WHERE id = ANY($1::int[]) 
       ORDER BY date DESC`,
      [projectIds]
    );

    // Normalize shape to match /api/projects
    const projects = await Promise.all(result.rows.map(async (row) => {
      const timelineResult = await pool.query(
        'SELECT * FROM project_timeline WHERE project_id = $1',
        [row.id]
      );

      const timelineItems = timelineResult.rows;
      const totalTasks = timelineItems.length;
      const completedTasks = timelineItems.filter(item => item.status === 'completed').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: row.id.toString(),
        clientName: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        projectType: row.project_type,
        budget: row.budget,
        timeline: row.timeline_range || row.timeline, // Handle both naming conventions if needed, or just map 'timeline' column
        source: row.source,
        targetAudience: row.target_audience,

        keyFeatures: row.key_features,
        requirements: row.requirements,
        status: row.status || 'Pending',
        createdAt: row.date,
        progress,
        timeline: timelineItems,
        notes: [],
      };
    }));

    res.json(projects);
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ message: 'Failed to fetch assigned projects' });
  }
});

// Fetch all inquiries as projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inquiries ORDER BY date DESC');

    // Get timeline data for all projects to calculate progress
    const projects = await Promise.all(result.rows.map(async (row) => {
      // Get timeline items for this project
      const timelineResult = await pool.query(
        'SELECT * FROM project_timeline WHERE project_id = $1',
        [row.id]
      );

      const timelineItems = timelineResult.rows;
      const totalTasks = timelineItems.length;
      const completedTasks = timelineItems.filter(item => item.status === 'completed').length;

      // Calculate progress percentage
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: row.id.toString(),
        clientName: row.name,
        email: row.email,
        phone: row.phone,
        company: row.company,
        projectType: row.project_type,
        budget: row.budget,
        timeline: row.timeline_range || row.timeline,
        source: row.source,
        targetAudience: row.target_audience,

        keyFeatures: row.key_features,
        requirements: row.requirements,
        status: row.status || 'Pending',
        createdAt: row.date,
        progress: progress,
        timeline: [],
        notes: [],
      };
    }));

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Fetch a single inquiry/project by ID
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM inquiries WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const row = result.rows[0];

    // Get timeline items for this project to calculate progress
    const timelineResult = await pool.query(
      'SELECT * FROM project_timeline WHERE project_id = $1',
      [id]
    );

    const timelineItems = timelineResult.rows;
    const totalTasks = timelineItems.length;
    const completedTasks = timelineItems.filter(item => item.status === 'completed').length;

    // Calculate progress percentage
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const project = {
      id: row.id.toString(),
      clientName: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      projectType: row.project_type,
      budget: row.budget,
      timeline: row.timeline_range || row.timeline,
      source: row.source,
      targetAudience: row.target_audience,
      keyFeatures: row.key_features,
      requirements: row.requirements,
      status: row.status || 'Pending',
      createdAt: row.date,
      progress: progress,
      timeline: [],
      notes: [],
    };
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Delete a project by ID
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', deletedProject: result.rows[0] });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Get project notes
app.get('/api/projects/:id/notes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM project_notes WHERE project_id = $1 ORDER BY timestamp DESC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project notes:', error);
    res.status(500).json({ message: 'Failed to fetch project notes' });
  }
});

// Add project note
app.post('/api/projects/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_notes (project_id, content) VALUES ($1, $2) RETURNING *',
      [id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding project note:', error);
    res.status(500).json({ message: 'Failed to add project note' });
  }
});

// Get project timeline
app.get('/api/projects/:id/timeline', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM project_timeline WHERE project_id = $1 ORDER BY date ASC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project timeline:', error);
    res.status(500).json({ message: 'Failed to fetch project timeline' });
  }
});

// Add project timeline item
app.post('/api/projects/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO project_timeline (project_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding project timeline item:', error);
    res.status(500).json({ message: 'Failed to add project timeline item' });
  }
});

// Update project timeline item status
app.put('/api/projects/:id/timeline/:taskId', async (req, res) => {
  const { id, taskId } = req.params;
  const { status } = req.body;
  try {
    // Update the timeline item status
    const result = await pool.query(
      'UPDATE project_timeline SET status = $1 WHERE id = $2 AND project_id = $3 RETURNING *',
      [status, taskId, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Timeline item not found' });
    }

    // Recalculate and update project progress
    const timelineResult = await pool.query(
      'SELECT * FROM project_timeline WHERE project_id = $1',
      [id]
    );

    const timelineItems = timelineResult.rows;
    const totalTasks = timelineItems.length;
    const completedTasks = timelineItems.filter(item => item.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update the project's progress in the database
    await pool.query(
      'UPDATE inquiries SET progress = $1 WHERE id = $2',
      [progress, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project timeline item:', error);
    res.status(500).json({ message: 'Failed to update project timeline item' });
  }
});

// Update project status
app.put('/api/projects/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Failed to update project status' });
  }
});

// AI Sentiment Analysis endpoints

// Fallback sentiment analysis function (rule-based)
function analyzeSentimentFallback(text) {
  const lowerText = text.toLowerCase();

  // Positive indicators
  const positiveWords = [
    'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy',
    'satisfied', 'pleased', 'impressed', 'thank', 'appreciate', 'perfect',
    'good', 'nice', 'awesome', 'brilliant', 'outstanding', 'superb'
  ];

  // Negative indicators
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'angry', 'frustrated',
    'disappointed', 'upset', 'concerned', 'worried', 'problem', 'issue',
    'wrong', 'failed', 'broken', 'unhappy', 'dissatisfied', 'complaint'
  ];

  // Count positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });

  // Determine sentiment based on word counts
  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

// Analyze project sentiment using Hugging Face API
app.post('/api/ai/sentiment', async (req, res) => {
  const { projectId, clientName, messages } = req.body;

  try {
    if (!projectId || !clientName || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'projectId, clientName and messages array are required' });
    }

    // Combine all messages into a single text for analysis
    const combinedText = messages
      .map(msg => msg.text)
      .join(' ')
      .substring(0, 500); // Limit to 500 characters for API efficiency

    if (!combinedText.trim()) {
      return res.status(400).json({ message: 'No valid text content found in messages' });
    }

    let sentimentData;
    let sentimentLabel;
    let confidenceScore;

    // Check if Hugging Face API key is available
    if (process.env.HUGGING_FACE_API_KEY) {
      try {
        // Use a better sentiment analysis model for more accuracy
        const huggingFaceResponse = await axios.post(
          'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
          { inputs: combinedText },
          {
            headers: {
              'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          }
        );

        sentimentData = huggingFaceResponse.data[0];

        // Map Hugging Face labels to our sentiment labels (5-star rating system)
        const labelMapping = {
          'LABEL_1': 'negative', // 1 star - very negative
          'LABEL_2': 'negative', // 2 stars - negative  
          'LABEL_3': 'neutral',  // 3 stars - neutral
          'LABEL_4': 'positive', // 4 stars - positive
          'LABEL_5': 'positive'  // 5 stars - very positive
        };

        sentimentLabel = labelMapping[sentimentData.label] || 'neutral';
        confidenceScore = sentimentData.score;

        console.log('Hugging Face Analysis:', {
          text: combinedText.substring(0, 100) + '...',
          label: sentimentData.label,
          score: sentimentData.score,
          mappedSentiment: sentimentLabel
        });
      } catch (apiError) {
        console.log('Hugging Face API failed, using fallback analysis:', apiError.message);
        // Fall through to fallback analysis
        sentimentData = null;
      }
    }

    // Fallback sentiment analysis if API key is missing or API fails
    let analysisMethod = 'huggingface';
    if (!sentimentData) {
      sentimentLabel = analyzeSentimentFallback(combinedText);
      confidenceScore = 0.85; // High confidence for fallback
      analysisMethod = 'fallback';
    }

    // Calculate relationship health score (0-100)
    let relationshipHealthScore;
    if (sentimentLabel === 'positive') {
      relationshipHealthScore = Math.round(80 + (confidenceScore * 20));
    } else if (sentimentLabel === 'neutral') {
      relationshipHealthScore = Math.round(50 + (confidenceScore * 29));
    } else { // negative
      relationshipHealthScore = Math.round(confidenceScore * 49);
    }

    // Generate AI summary based on sentiment
    let summary;
    if (sentimentLabel === 'positive') {
      summary = `The client appears satisfied with recent progress. Communication shows positive engagement and satisfaction.`;
    } else if (sentimentLabel === 'neutral') {
      summary = `Client communication shows neutral sentiment. No strong positive or negative indicators detected.`;
    } else {
      summary = `Client communication indicates concerns or dissatisfaction. Immediate attention may be needed.`;
    }

    // Get existing sentiment data to update trend history
    const existingSentiment = await pool.query(
      'SELECT * FROM project_sentiment WHERE project_id = $1',
      [projectId]
    );

    let trendHistory = [];
    if (existingSentiment.rows.length > 0) {
      trendHistory = existingSentiment.rows[0].trend_history || [];
    }

    // Add current score to trend history
    trendHistory.push({
      score: relationshipHealthScore,
      date: new Date().toISOString()
    });

    // Keep only last 30 entries to prevent unbounded growth
    if (trendHistory.length > 30) {
      trendHistory = trendHistory.slice(-30);
    }

    // Upsert sentiment data
    const result = await pool.query(
      `INSERT INTO project_sentiment 
       (project_id, client_name, sentiment_label, confidence_score, relationship_health_score, summary, analysis_method, trend_history, last_analyzed_message, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
       ON CONFLICT (project_id) 
       DO UPDATE SET 
         client_name = EXCLUDED.client_name,
         sentiment_label = EXCLUDED.sentiment_label,
         confidence_score = EXCLUDED.confidence_score,
         relationship_health_score = EXCLUDED.relationship_health_score,
         summary = EXCLUDED.summary,
         analysis_method = EXCLUDED.analysis_method,
         trend_history = EXCLUDED.trend_history,
         last_analyzed_message = EXCLUDED.last_analyzed_message,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [projectId, clientName, sentimentLabel, confidenceScore, relationshipHealthScore, summary, analysisMethod, JSON.stringify(trendHistory), combinedText]
    );

    const sentimentRecord = result.rows[0];

    res.json({
      projectId: sentimentRecord.project_id,
      clientName: sentimentRecord.client_name,
      sentimentLabel: sentimentRecord.sentiment_label,
      confidenceScore: parseFloat(sentimentRecord.confidence_score),
      relationshipHealthScore: sentimentRecord.relationship_health_score,
      summary: sentimentRecord.summary,
      analysisMethod: sentimentRecord.analysis_method,
      trendHistory: trendHistory.map(item => ({
        score: item.score,
        date: new Date(item.date)
      })),
      lastAnalyzedMessage: sentimentRecord.last_analyzed_message,
      updatedAt: sentimentRecord.updated_at
    });

  } catch (error) {
    console.error('Error analyzing sentiment:', error);

    // If Hugging Face API fails, return a fallback response
    if (error.response?.status === 503) {
      res.status(503).json({
        message: 'AI sentiment analysis service temporarily unavailable',
        fallback: true
      });
    } else {
      res.status(500).json({ message: 'Failed to analyze sentiment' });
    }
  }
});

// Auto-generate sentiment analysis for projects without data
app.post('/api/ai/sentiment/generate-all', async (req, res) => {
  try {
    // Get all projects
    const projectsResult = await pool.query('SELECT * FROM inquiries ORDER BY date DESC');

    const results = [];

    for (const project of projectsResult.rows) {
      // Check if sentiment data already exists
      const existingSentiment = await pool.query(
        'SELECT * FROM project_sentiment WHERE project_id = $1',
        [project.id.toString()]
      );

      if (existingSentiment.rows.length === 0) {
        // Generate sample messages based on project status and requirements
        const sampleMessages = generateSampleMessages(project);

        // Analyze sentiment
        const combinedText = sampleMessages.join(' ');
        const sentimentLabel = analyzeSentimentFallback(combinedText);
        const confidenceScore = 0.75;

        // Calculate health score
        let relationshipHealthScore;
        if (sentimentLabel === 'positive') {
          relationshipHealthScore = Math.round(80 + (confidenceScore * 20));
        } else if (sentimentLabel === 'neutral') {
          relationshipHealthScore = Math.round(50 + (confidenceScore * 29));
        } else {
          relationshipHealthScore = Math.round(confidenceScore * 49);
        }

        // Generate summary
        let summary;
        if (sentimentLabel === 'positive') {
          summary = `The client appears satisfied with the ${project.project_type} project. Communication shows positive engagement.`;
        } else if (sentimentLabel === 'neutral') {
          summary = `Client communication shows neutral sentiment for the ${project.project_type} project. No strong indicators detected.`;
        } else {
          summary = `Client communication indicates concerns about the ${project.project_type} project. Attention may be needed.`;
        }

        // Insert sentiment data
        await pool.query(
          `INSERT INTO project_sentiment 
           (project_id, client_name, sentiment_label, confidence_score, relationship_health_score, summary, analysis_method, trend_history, last_analyzed_message, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
          [
            project.id.toString(),
            project.name,
            sentimentLabel,
            confidenceScore,
            relationshipHealthScore,
            summary,
            'fallback',
            JSON.stringify([{ score: relationshipHealthScore, date: new Date().toISOString() }]),
            combinedText
          ]
        );

        results.push({
          projectId: project.id.toString(),
          clientName: project.name,
          generated: true,
          sentiment: sentimentLabel,
          healthScore: relationshipHealthScore
        });
      } else {
        results.push({
          projectId: project.id.toString(),
          clientName: project.name,
          generated: false,
          message: 'Already has sentiment data'
        });
      }
    }

    res.json({
      message: 'Sentiment analysis generation completed',
      results: results,
      totalProjects: projectsResult.rows.length,
      generatedCount: results.filter(r => r.generated).length
    });

  } catch (error) {
    console.error('Error generating sentiment analysis:', error);
    res.status(500).json({ message: 'Failed to generate sentiment analysis' });
  }
});

// Helper function to generate sample messages based on project data
function generateSampleMessages(project) {
  const messages = [];

  // Add project type as context
  messages.push(`Project type: ${project.project_type}`);

  // Add requirements context
  if (project.requirements) {
    messages.push(`Requirements: ${project.requirements.substring(0, 200)}`);
  }

  // Add status-based context
  switch (project.status) {
    case 'Pending':
      messages.push('Project is currently pending review and approval');
      break;
    case 'In Progress':
      messages.push('Project is currently in active development phase');
      break;
    case 'Completed':
      messages.push('Project has been successfully completed and delivered');
      break;
    default:
      messages.push('Project status is being managed');
  }

  // Add some generic positive context for most projects
  messages.push('Client is working with our team on this project');

  return messages;
}

// Get project sentiment data
app.get('/api/ai/sentiment/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM project_sentiment WHERE project_id = $1',
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No sentiment data found for this project' });
    }

    const sentimentRecord = result.rows[0];
    const trendHistory = sentimentRecord.trend_history || [];

    res.json({
      projectId: sentimentRecord.project_id,
      clientName: sentimentRecord.client_name,
      sentimentLabel: sentimentRecord.sentiment_label,
      confidenceScore: parseFloat(sentimentRecord.confidence_score),
      relationshipHealthScore: sentimentRecord.relationship_health_score,
      summary: sentimentRecord.summary,
      analysisMethod: sentimentRecord.analysis_method,
      trendHistory: trendHistory.map(item => ({
        score: item.score,
        date: new Date(item.date)
      })),
      lastAnalyzedMessage: sentimentRecord.last_analyzed_message,
      updatedAt: sentimentRecord.updated_at
    });

  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    res.status(500).json({ message: 'Failed to fetch sentiment data' });
  }
});

// Authentication endpoints

// User signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 