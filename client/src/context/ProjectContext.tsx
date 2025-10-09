import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, ProjectNote, ProjectTimelineItem } from '../types/Project';
import { mockProjects } from '../data/mockProjects';

interface ProjectContextType {
  projects: Project[];
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  addProjectNote: (projectId: string, content: string) => void;
  updateProjectTask: (projectId: string, taskId: string, status: 'completed' | 'current' | 'pending') => void;
  addProjectTask: (projectId: string, title: string, description?: string) => void;
  getProject: (projectId: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status }
          : project
      )
    );
  };

  const addProjectNote = (projectId: string, content: string) => {
    const newNote: ProjectNote = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString().split('T')[0]
    };

    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, notes: [...project.notes, newNote] }
          : project
      )
    );
  };

  const updateProjectTask = (projectId: string, taskId: string, status: 'completed' | 'current' | 'pending') => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              timeline: project.timeline.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      status,
                      date: status === 'completed' ? new Date().toISOString().split('T')[0] : task.date
                    }
                  : task
              ),
              // Update progress based on completed tasks
              progress: Math.round(
                (project.timeline.filter(task => 
                  task.id === taskId ? status === 'completed' : task.status === 'completed'
                ).length / project.timeline.length) * 100
              )
            }
          : project
      )
    );
  };

  const addProjectTask = (projectId: string, title: string, description?: string) => {
    const newTask: ProjectTimelineItem = {
      id: Date.now().toString(),
      title,
      status: 'pending',
      description
    };

    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              timeline: [...project.timeline, newTask],
              // Recalculate progress
              progress: Math.round(
                (project.timeline.filter(task => task.status === 'completed').length / 
                (project.timeline.length + 1)) * 100
              )
            }
          : project
      )
    );
  };

  const getProject = (projectId: string): Project | undefined => {
    return projects.find(project => project.id === projectId);
  };

  const value: ProjectContextType = {
    projects,
    updateProjectStatus,
    addProjectNote,
    updateProjectTask,
    addProjectTask,
    getProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};