import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';

interface ProjectFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
            Search Projects
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              placeholder="Search by client name, email, or project type..."
            />
          </div>
        </div>
        
        <div className="sm:w-56">
          <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-700 mb-3">
            Filter by Status
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-12 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm bg-white transition-all duration-200"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};