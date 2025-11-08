import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus, ExternalLink, Brain, Zap } from 'lucide-react';
import { ProjectSentiment } from '../types/Sentiment';
import { sentimentApi } from '../utils/sentimentApi';

interface RelationshipHealthCardProps {
  projectId: string;
  clientName: string;
  className?: string;
}

const RelationshipHealthCard: React.FC<RelationshipHealthCardProps> = ({ 
  projectId,
  clientName,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [sentiment, setSentiment] = useState<ProjectSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const data = await sentimentApi.getProjectSentiment(projectId);
        setSentiment(data);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load sentiment data';
        setError(errorMessage);
        console.error('Error fetching sentiment:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchSentiment();
    }
  }, [projectId]);

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <Smile className="w-5 h-5 text-green-600" />;
      case 'neutral':
        return <Meh className="w-5 h-5 text-yellow-600" />;
      case 'negative':
        return <Frown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
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

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = () => {
    if (!sentiment?.trendHistory || sentiment.trendHistory.length < 2) {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }

    const latest = sentiment.trendHistory[sentiment.trendHistory.length - 1].score;
    const previous = sentiment.trendHistory[sentiment.trendHistory.length - 2].score;

    if (latest > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (latest < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAnalysisMethodIcon = (method: string) => {
    switch (method) {
      case 'huggingface':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'fallback':
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !sentiment) {
    return (
      <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center text-gray-500">
          <Meh className="w-6 h-6 mr-2" />
          <span className="text-sm">No sentiment data for this project</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Sentiment</h3>
        <div className="flex items-center space-x-2">
          {getSentimentIcon(sentiment.sentimentLabel)}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(sentiment.sentimentLabel)}`}>
            {sentiment.sentimentLabel.charAt(0).toUpperCase() + sentiment.sentimentLabel.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {sentiment.relationshipHealthScore}
          </span>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              sentiment.relationshipHealthScore >= 80 ? 'bg-green-500' :
              sentiment.relationshipHealthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${sentiment.relationshipHealthScore}%` }}
          ></div>
        </div>
      </div>

      {sentiment.summary && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {sentiment.summary}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-2">
          {getAnalysisMethodIcon(sentiment.analysisMethod)}
          <span className="capitalize">{sentiment.analysisMethod} Analysis</span>
        </div>
        <span>Confidence: {Math.round(sentiment.confidenceScore * 100)}%</span>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        <span>Updated: {formatDate(sentiment.updatedAt)}</span>
      </div>

      {sentiment.lastAnalyzedMessage && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Last analyzed message:</p>
          <p className="text-xs text-gray-700 italic">
            "{sentiment.lastAnalyzedMessage.substring(0, 100)}{sentiment.lastAnalyzedMessage.length > 100 ? '...' : ''}"
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(`/sentiment/${projectId}`)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Detailed Analysis</span>
        </button>
      </div>
    </div>
  );
};

export default RelationshipHealthCard;
