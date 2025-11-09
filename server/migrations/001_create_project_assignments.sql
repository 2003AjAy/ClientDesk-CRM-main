-- Create project_assignments table to track which developers are assigned to which projects
CREATE TABLE IF NOT EXISTS project_assignments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    developer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, developer_id)
);

-- Create an index for faster lookups by developer_id
CREATE INDEX IF NOT EXISTS idx_project_assignments_developer_id ON project_assignments(developer_id);

-- Create an index for faster lookups by project_id
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);
