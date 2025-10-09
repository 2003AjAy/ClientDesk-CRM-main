import React, { useState } from 'react';
import { ProjectNote } from '../types/Project';
import { Clock, Plus, MessageSquare, Edit3 } from 'lucide-react';

interface ProjectNotesProps {
  notes: ProjectNote[];
  onAddNote: (content: string) => void;
}

export const ProjectNotes: React.FC<ProjectNotesProps> = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
      setIsAdding(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Notes & Updates</h3>
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Existing Notes */}
        <div className="space-y-6 mb-8">
          {notes.map((note) => (
            <div key={note.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 mb-2">
                  {formatDate(note.timestamp)}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{note.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Note */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg border border-blue-200 transition-all duration-200 font-medium"
          >
            <Plus className="h-5 w-5" />
            <Edit3 className="h-4 w-4" />
            <span className="text-sm font-semibold">Add New Update</span>
          </button>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Progress Update
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Describe the progress, changes, or important notes about this project..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm transition-all duration-200"
                  rows={4}
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                >
                  Add Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote('');
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};