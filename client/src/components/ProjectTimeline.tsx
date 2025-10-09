import React from 'react';
import { useState } from 'react';
import { ProjectTimelineItem } from '../types/Project';
import { CheckCircle, Clock, Circle, Plus, Edit3, Check, X } from 'lucide-react';

interface ProjectTimelineProps {
  timeline: ProjectTimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  onUpdateTask?: (taskId: string, status: 'completed' | 'current' | 'pending') => void;
  onAddTask?: (title: string, description?: string) => void;
  editable?: boolean;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ 
  timeline, 
  orientation = 'vertical',
  onUpdateTask,
  onAddTask,
  editable = false
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 border-emerald-300';
      case 'current':
        return 'bg-blue-100 border-blue-300 ring-2 ring-blue-200';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getConnectorColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-300';
      case 'current':
        return 'bg-gradient-to-b from-emerald-300 to-blue-300';
      default:
        return 'bg-gray-300';
    }
  };

  const handleStatusToggle = (taskId: string, currentStatus: string) => {
    if (!onUpdateTask) return;
    
    let newStatus: 'completed' | 'current' | 'pending';
    if (currentStatus === 'completed') {
      newStatus = 'pending';
    } else if (currentStatus === 'pending') {
      newStatus = 'completed';
    } else {
      newStatus = 'completed';
    }
    
    onUpdateTask(taskId, newStatus);
  };

  const handleAddTask = () => {
    if (!onAddTask || !newTaskTitle.trim()) return;
    
    onAddTask(newTaskTitle.trim(), newTaskDescription.trim() || undefined);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsAddingTask(false);
  };

  if (orientation === 'horizontal') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(item.status)} shadow-sm relative group`}>
                  {getStatusIcon(item.status)}
                  {editable && (
                    <button
                      onClick={() => handleStatusToggle(item.id, item.status)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:border-blue-500 hover:bg-blue-50"
                      title={item.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {item.status === 'completed' ? (
                        <X className="h-3 w-3 text-gray-600" />
                      ) : (
                        <Check className="h-3 w-3 text-green-600" />
                      )}
                    </button>
                  )}
                </div>
                <div className="mt-3 text-center max-w-24">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{item.title}</p>
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              {index < timeline.length - 1 && (
                <div className={`w-16 h-1 mx-4 rounded-full ${getConnectorColor(item.status)}`}></div>
              )}
            </div>
          ))}
        </div>
        
        {editable && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg border border-blue-200 transition-all duration-200 font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Task</span>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description (optional)..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddTask}
                      disabled={!newTaskTitle.trim()}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskTitle('');
                        setNewTaskDescription('');
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flow-root">
        <ul className="-mb-8">
          {timeline.map((item, index) => (
            <li key={item.id}>
              <div className="relative pb-8">
                {index !== timeline.length - 1 && (
                  <span 
                    className={`absolute top-5 left-5 -ml-px h-full w-0.5 ${getConnectorColor(item.status)}`} 
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStatusColor(item.status)} shadow-sm relative group`}>
                    {getStatusIcon(item.status)}
                    {editable && (
                      <button
                        onClick={() => handleStatusToggle(item.id, item.status)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:border-blue-500 hover:bg-blue-50"
                        title={item.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                      >
                        {item.status === 'completed' ? (
                          <X className="h-3 w-3 text-gray-600" />
                        ) : (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      {item.date && (
                        <time className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {editable && (
        <div className="pt-4 border-t border-gray-200">
          {!isAddingTask ? (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg border border-blue-200 transition-all duration-200 font-medium"
            >
              <Plus className="h-5 w-5" />
              <Edit3 className="h-4 w-4" />
              <span className="text-sm font-semibold">Add New Task</span>
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTaskTitle('');
                      setNewTaskDescription('');
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};