export interface SentimentMessage {
  text: string;
  date: string;
}

export interface SentimentAnalysis {
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
  summary: string;
}

export interface ProjectSentiment {
  projectId: string;
  clientName: string;
  sentimentLabel: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
  relationshipHealthScore: number;
  summary: string;
  analysisMethod: 'huggingface' | 'fallback';
  trendHistory: Array<{
    score: number;
    date: Date;
  }>;
  lastAnalyzedMessage?: string;
  updatedAt: Date;
}

export interface SentimentRequest {
  projectId: string;
  clientName: string;
  messages: SentimentMessage[];
}
