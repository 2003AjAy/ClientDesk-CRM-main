import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
  color?: 'blue' | 'green' | 'amber' | 'red';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  size = 'md', 
  showPercentage = true, 
  animated = true,
  color = 'blue'
}) => {
  const getBarHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'amber':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500';
      case 'red':
        return 'bg-gradient-to-r from-red-500 to-rose-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'green';
    if (progress >= 70) return 'blue';
    if (progress >= 30) return 'amber';
    return 'red';
  };

  const progressColor = color === 'blue' ? getProgressColor() : color;

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getBarHeight()} overflow-hidden shadow-inner`}>
        <div 
          className={`${getBarHeight()} rounded-full shadow-sm transition-all duration-700 ease-out ${
            animated ? 'transform-gpu' : ''
          }`}
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            background: progressColor === 'green' 
              ? 'linear-gradient(to right, #10b981, #059669)' 
              : progressColor === 'amber'
              ? 'linear-gradient(to right, #f59e0b, #d97706)'
              : progressColor === 'red'
              ? 'linear-gradient(to right, #ef4444, #dc2626)'
              : 'linear-gradient(to right, #3b82f6, #6366f1)'
          }}
        >
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
};