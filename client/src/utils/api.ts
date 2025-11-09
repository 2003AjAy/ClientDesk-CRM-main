export interface Developer {
  id: number;
  name: string;
  email: string;
  role: string;
  assigned_projects: number;
}

export async function fetchProjects() {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function fetchDevelopers(): Promise<Developer[]> {
  const response = await fetch('/api/developers', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch developers');
  }
  
  return response.json();
}

export async function assignProjectToDeveloper(developerId: number, projectId: number) {
  const response = await fetch('/api/developers/assign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ developerId, projectId })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to assign project');
  }
  
  return response.json();
}

export async function fetchAssignedProjects(developerId: string) {
  try {
    const response = await fetch(`/api/projects/assigned/${developerId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch assigned projects');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchAssignedProjects:', error);
    throw error;
  }
}

export async function fetchProjectById(id: string) {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch project');
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
}

// Project Notes API
export async function fetchProjectNotes(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/notes`);
  if (!response.ok) throw new Error('Failed to fetch project notes');
  return response.json();
}

export async function addProjectNote(projectId: string, content: string) {
  const response = await fetch(`/api/projects/${projectId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Failed to add project note');
  return response.json();
}

// Project Timeline API
export async function fetchProjectTimeline(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/timeline`);
  if (!response.ok) throw new Error('Failed to fetch project timeline');
  return response.json();
}

export async function addProjectTimelineItem(projectId: string, title: string, description?: string) {
  const response = await fetch(`/api/projects/${projectId}/timeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) throw new Error('Failed to add project timeline item');
  return response.json();
}

export async function updateProjectTimelineItem(projectId: string, taskId: string, status: string) {
  const response = await fetch(`/api/projects/${projectId}/timeline/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update project timeline item');
  return response.json();
}

export async function updateProjectStatus(projectId: string, status: string) {
  const response = await fetch(`/api/projects/${projectId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update project status');
  return response.json();
}

