require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Placeholder endpoint for form submissions
app.post('/api/submit', async (req, res) => {
  const { name, email, phone, projectType, requirements, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inquiries (name, email, phone, project_type, requirements, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, projectType, requirements, date]
    );
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: result.rows[0] });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ message: 'Failed to submit inquiry' });
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
        projectType: row.project_type,
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
      projectType: row.project_type,
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