import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/progressBar';
import { ProjectTimeline } from '../components/ProjectTimeline';
import { ProjectNotes } from '../components/ProjectNotes';
import RelationshipHealthCard from '../components/RelationshipHealthCard';
import { 
  fetchProjectById, 
  fetchProjectNotes, 
  addProjectNote, 
  fetchProjectTimeline, 
  addProjectTimelineItem, 
  updateProjectTimelineItem,
  updateProjectStatus
} from '../utils/api';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, Settings, Briefcase, Star, TrendingUp } from 'lucide-react';
import { ProjectNote, ProjectTimelineItem } from '../types/Project';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    const loadProjectData = async () => {
      try {
        const [projectData, notesData, timelineData] = await Promise.all([
          fetchProjectById(id),
          fetchProjectNotes(id),
          fetchProjectTimeline(id)
        ]);
        
        setProject(projectData);
        setNotes(notesData);
        setTimeline(timelineData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      const updatedProject = await updateProjectStatus(id, newStatus);
      setProject(prevProject => ({ ...prevProject, status: updatedProject.status }));
    } catch (err) {
      console.error('Error updating project status:', err);
      alert('Failed to update project status. Please try again.');
    }
  };

  const handleAddNote = async (content: string) => {
    if (!id) return;
    try {
      const newNote = await addProjectNote(id, content);
      setNotes(prevNotes => [newNote, ...prevNotes]);
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    }
  };

  const handleUpdateTask = async (taskId: string, status: 'completed' | 'current' | 'pending') => {
    if (!id) return;
    try {
      const updatedTask = await updateProjectTimelineItem(id, taskId, status);
      setTimeline(prevTimeline => 
        prevTimeline.map(task => 
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        )
      );
      
      // Refresh project data to get updated progress
      const updatedProject = await fetchProjectById(id);
      setProject(updatedProject);
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    if (!id) return;
    try {
      const newTask = await addProjectTimelineItem(id, title, description);
      setTimeline(prevTimeline => [...prevTimeline, newTask]);
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Failed to add task. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>
    );
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg mb-6 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Project Details</h1>
              <p className="text-gray-600 text-lg mt-1">Complete project overview and management</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Project Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Project Info */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Project Information</h2>
                </div>
              </div>
              <div className="px-6 py-8 space-y-8">
                {/* Client Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center uppercase tracking-wider">
                    <User className="h-4 w-4 mr-2" />
                    Client Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                      <p className="text-sm text-gray-900 font-medium">{project.clientName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-900 flex items-center font-medium">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        {project.email}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-900 flex items-center font-medium">
                        <Phone className="h-3 w-3 mr-2 text-gray-400" />
                        {project.phone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Date Created</label>
                      <p className="text-sm text-gray-900 flex items-center font-medium">
                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center uppercase tracking-wider">
                    <FileText className="h-4 w-4 mr-2" />
                    Project Details
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Project Type</label>
                      <p className="text-sm text-gray-900 font-medium">{project.projectType}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
                      <p className="text-sm text-gray-900 leading-relaxed">{project.requirements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Relationship Health */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Client Relationship Health</h2>
                </div>
              </div>
              <div className="px-6 py-8">
                <RelationshipHealthCard 
                  projectId={id || ''} 
                  clientName={project?.clientName || 'Unknown Client'} 
                />
              </div>
            </div>

            {/* Project Notes */}
            <ProjectNotes notes={notes} onAddNote={handleAddNote} />

            {/* Project Timeline */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Project Timeline</h3>
                </div>
              </div>
              <div className="px-6 py-8">
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Progress Overview</h4>
                  <ProjectTimeline 
                    timeline={timeline} 
                    orientation="horizontal" 
                    editable={true}
                    onUpdateTask={handleUpdateTask}
                    onAddTask={handleAddTask}
                  />
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Detailed Timeline</h4>
                  <ProjectTimeline 
                    timeline={timeline} 
                    orientation="vertical" 
                    editable={true}
                    onUpdateTask={handleUpdateTask}
                    onAddTask={handleAddTask}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Status Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-8">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Settings className="h-5 w-5 mr-3" />
                  Project Management
                </h3>
              </div>
              <div className="px-6 py-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Current Status
                    </label>
                    <StatusBadge status={project.status} />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label htmlFor="status-select" className="block text-sm font-semibold text-gray-700 mb-3">
                      Update Status
                    </label>
                    <select
                      id="status-select"
                      value={project.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Project ID:</span>
                        <span className="font-mono text-gray-700">#{project.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last Updated:</span>
                        <span className="text-gray-700">{formatDate(notes[0]?.timestamp || project.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};