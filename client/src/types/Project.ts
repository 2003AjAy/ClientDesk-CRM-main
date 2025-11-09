export interface Project {
    id: string;
    title: string;
    clientName: string;
    email: string;
    phone: string;
    projectType: string;
    requirements: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Not Started';
    createdAt: string;
    deadline?: string;
    progress: number; // 0-100 percentage
    timeline: ProjectTimelineItem[];
    notes: ProjectNote[];
  }
  
  export interface ProjectNote {
    id: string;
    content: string;
    timestamp: string;
  }
  
  export interface ProjectTimelineItem {
    id: string;
    title: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
    description?: string;
  }