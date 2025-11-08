import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/Project';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './progressBar';
import { Calendar, Mail, Phone, User, ArrowRight, Smile, Meh, Frown, Brain } from 'lucide-react';
import { sentimentApi } from '../utils/sentimentApi';
import { ProjectSentiment } from '../types/Sentiment';

interface ProjectTableProps {
  projects: Project[];
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [sentimentData, setSentimentData] = useState<Record<string, ProjectSentiment>>({});

  useEffect(() => {
    const fetchSentimentData = async () => {
      const sentimentPromises = projects.map(async (project) => {
        try {
          const data = await sentimentApi.getProjectSentiment(project.id);
          return { projectId: project.id, data };
        } catch (error) {
          return { projectId: project.id, data: null };
        }
      });

      const results = await Promise.all(sentimentPromises);
      const sentimentMap: Record<string, ProjectSentiment> = {};
      
      results.forEach(({ projectId, data }) => {
        if (data) {
          sentimentMap[projectId] = data;
        }
      });

      setSentimentData(sentimentMap);
    };

    if (projects.length > 0) {
      fetchSentimentData();
    }
  }, [projects]);

  const handleRowClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-600" />;
      case 'neutral':
        return <Meh className="w-4 h-4 text-yellow-600" />;
      case 'negative':
        return <Frown className="w-4 h-4 text-red-600" />;
      default:
        return <Meh className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSentimentClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/sentiment/${projectId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{project.clientName}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1.5" />
                        {project.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{project.projectType}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate leading-relaxed">{project.requirements}</div>
                  <div className="mt-3">
                    <ProgressBar progress={project.progress} size="sm" showPercentage={false} />
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(project.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {sentimentData[project.id] ? (
                    <button
                      onClick={(e) => handleSentimentClick(e, project.id)}
                      className="flex items-center space-x-2 px-3 py-1 rounded-full border hover:shadow-sm transition-all duration-200 group/sentiment"
                    >
                      {getSentimentIcon(sentimentData[project.id].sentimentLabel)}
                      <span className={`text-xs font-medium border ${getSentimentColor(sentimentData[project.id].sentimentLabel)} px-2 py-1 rounded-full`}>
                        {sentimentData[project.id].sentimentLabel}
                      </span>
                      <Brain className="w-3 h-3 text-gray-400 group-hover/sentiment:text-blue-600 transition-colors" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Meh className="w-4 h-4" />
                      <span className="text-xs">No data</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium mr-2">View Details</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};