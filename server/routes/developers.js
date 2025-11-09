const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all developers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, 
        (SELECT COUNT(*) FROM project_assignments WHERE developer_id = u.id) as assigned_projects
       FROM users u 
       WHERE u.role = 'developer'`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

// Assign project to developer
router.post('/assign', async (req, res) => {
  const { developerId, projectId } = req.body;
  
  try {
    // Check if the assignment already exists
    const existing = await pool.query(
      'SELECT * FROM project_assignments WHERE developer_id = $1 AND project_id = $2',
      [developerId, projectId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'This project is already assigned to the developer' });
    }

    // Create the assignment
    const result = await pool.query(
      'INSERT INTO project_assignments (developer_id, project_id) VALUES ($1, $2) RETURNING *',
      [developerId, projectId]
    );

    // Update the project status to 'In Progress' if it's 'Pending'
    await pool.query(
      "UPDATE inquiries SET status = 'In Progress' WHERE id = $1 AND status = 'Pending'",
      [projectId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error assigning project:', error);
    res.status(500).json({ error: 'Failed to assign project' });
  }
});

// Get projects assigned to a developer
router.get('/:developerId/projects', async (req, res) => {
  const { developerId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT p.*, i.client_name, i.requirements
       FROM project_assignments pa
       JOIN projects p ON pa.project_id = p.id
       JOIN inquiries i ON p.inquiry_id = i.id
       WHERE pa.developer_id = $1`,
      [developerId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ error: 'Failed to fetch assigned projects' });
  }
});

// Remove project assignment
router.delete('/assignments/:assignmentId', async (req, res) => {
  const { assignmentId } = req.params;
  
  try {
    await pool.query('DELETE FROM project_assignments WHERE id = $1', [assignmentId]);
    res.json({ message: 'Assignment removed successfully' });
  } catch (error) {
    console.error('Error removing assignment:', error);
    res.status(500).json({ error: 'Failed to remove assignment' });
  }
});

module.exports = router;
