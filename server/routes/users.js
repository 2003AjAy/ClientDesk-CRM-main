const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all developers
router.get('/developers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, 
        (SELECT COUNT(*) FROM project_assignments WHERE developer_id = users.id) as assigned_projects
       FROM users 
       WHERE role = 'developer'`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

module.exports = router;
