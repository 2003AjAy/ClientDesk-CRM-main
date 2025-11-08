import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { ProjectSentiment, SentimentMessage } from '../types/Sentiment';
import { sentimentApi } from '../utils/sentimentApi';
import RelationshipHealthCard from '../components/RelationshipHealthCard';

const SentimentDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sentiment, setSentiment] = useState<ProjectSentiment | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchSentimentData();
    }
  }, [projectId]);

  const fetchSentimentData = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await sentimentApi.getProjectSentiment(projectId);
      setSentiment(data);
      if (data) {
        setClientName(data.clientName);
      }
    } catch (err) {
      setError('Failed to load sentiment data');
      console.error('Error fetching sentiment:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeNewMessage = async () => {
    if (!projectId || !newMessage.trim() || !clientName) return;

    try {
      setAnalyzing(true);
      setError(null);

      const messages: SentimentMessage[] = [
        {
          text: newMessage,
          date: new Date().toISOString()
        }
      ];

      const result = await sentimentApi.analyzeSentiment({
        projectId,
        clientName,
        messages
      });

      setSentiment(result);
      setNewMessage('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to analyze message';
      setError(errorMessage);
      console.error('Error analyzing sentiment:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <Smile className="w-8 h-8 text-green-600" />;
      case 'neutral':
        return <Meh className="w-8 h-8 text-yellow-600" />;
      case 'negative':
        return <Frown className="w-8 h-8 text-red-600" />;
      default:
        return <Meh className="w-8 h-8 text-gray-600" />;
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

  const getTrendDirection = () => {
    if (!sentiment?.trendHistory || sentiment.trendHistory.length < 2) {
      return 'stable';
    }

    const latest = sentiment.trendHistory[sentiment.trendHistory.length - 1].score;
    const previous = sentiment.trendHistory[sentiment.trendHistory.length - 2].score;

    if (latest > previous + 5) return 'improving';
    if (latest < previous - 5) return 'declining';
    return 'stable';
  };

  const formatChartData = () => {
    if (!sentiment?.trendHistory) return [];

    return sentiment.trendHistory.map((item, index) => ({
      name: `Day ${index + 1}`,
      score: item.score,
      date: new Date(item.date).toLocaleDateString()
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchSentimentData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sentiment) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Sentiment Analysis</h1>
          
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <Meh className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Sentiment Data</h2>
            <p className="text-gray-600 mb-6">
              Start analyzing client sentiment by adding a message below.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex space-x-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter client message or feedback to analyze..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <button
                onClick={analyzeNewMessage}
                disabled={!newMessage.trim() || analyzing}
                className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Analyze Sentiment</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const trendDirection = getTrendDirection();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Sentiment Analysis</h1>
          <button
            onClick={fetchSentimentData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Status Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Sentiment</h2>
              {getSentimentIcon(sentiment.sentimentLabel)}
            </div>
            
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getSentimentColor(sentiment.sentimentLabel)}`}>
                {sentiment.sentimentLabel.charAt(0).toUpperCase() + sentiment.sentimentLabel.slice(1)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Confidence</span>
                <span className="font-medium">{Math.round(sentiment.confidenceScore * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Health Score</span>
                <span className="font-medium text-lg">{sentiment.relationshipHealthScore}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trend</span>
                <div className="flex items-center space-x-1">
                  {trendDirection === 'improving' && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {trendDirection === 'declining' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {trendDirection === 'stable' && <Meh className="w-4 h-4 text-gray-500" />}
                  <span className="text-sm capitalize">{trendDirection}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Summary</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {sentiment.summary}
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(sentiment.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Relationship Health Trend</h2>
          
          {sentiment.trendHistory && sentiment.trendHistory.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}/100`, 'Health Score']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `Date: ${payload[0].payload.date}`;
                      }
                      return label;
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No trend data available yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Add New Message Section */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyze New Message</h2>
          <div className="flex space-x-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter client message or feedback to analyze..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={analyzeNewMessage}
              disabled={!newMessage.trim() || analyzing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 self-start"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentDashboard;
