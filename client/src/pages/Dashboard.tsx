import React, { useState, useMemo, useEffect } from 'react';
import { ProjectTable } from '../components/ProjectTable';
import { ProjectFilters } from '../components/ProjectFilters';
import { fetchProjects, deleteProject } from '../utils/api';
import { BarChart3, Users, Clock, CheckCircle, TrendingUp, Activity, Search, RefreshCw } from 'lucide-react';
import { Project } from '../types/Project';
import DashboardNavbar from '../components/DashboardNavbar';

export const Dashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = () => {
    setLoading(true);
    fetchProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Refresh projects when the page becomes visible (user returns from project details)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProjects();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      const matchesSearch = 
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchTerm, projects]);

  const stats = useMemo(() => {
    const total = projects.length;
    const pending = projects.filter((p: Project) => p.status === 'Pending').length;
    const inProgress = projects.filter((p: Project) => p.status === 'In Progress').length;
    const completed = projects.filter((p: Project) => p.status === 'Completed').length;
    return { total, pending, inProgress, completed };
  }, [projects]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage client projects and track progress with ease</p>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+12% this month</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-amber-600 font-medium">Awaiting review</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-blue-600 font-medium">Active development</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-emerald-600 font-medium">Successfully delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <ProjectFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        {/* Projects Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Projects ({filteredProjects.length})
            </h2>
            <button
              onClick={loadProjects}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <ProjectTable projects={filteredProjects} />
        </div>
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">No projects found</p>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};