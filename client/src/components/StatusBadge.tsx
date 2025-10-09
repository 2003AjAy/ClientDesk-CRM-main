import React from 'react';

interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Pending':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200 shadow-sm ring-1 ring-amber-200/50';
      case 'In Progress':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 shadow-sm ring-1 ring-blue-200/50';
      case 'Completed':
        return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200 shadow-sm ring-1 ring-emerald-200/50';
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-sm ring-1 ring-red-200/50';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200 shadow-sm ring-1 ring-gray-200/50';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'In Progress':
        return '🔄';
      case 'Completed':
        return '✅';
      case 'Cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full font-bold border backdrop-blur-sm ${getStatusStyles()} ${getSizeStyles()}`}>
      <span className="mr-1.5">{getStatusIcon()}</span>
      {status}
    </span>
  );
};