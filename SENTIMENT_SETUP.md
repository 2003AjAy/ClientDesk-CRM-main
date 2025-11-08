# AI Sentiment Analysis Setup Guide

## 🎯 Overview
This guide will help you set up the AI-powered "Client Sentiment & Relationship Health" feature in your ClientDesk CRM.

## 🔧 Backend Setup

### 1. Install Dependencies
The required dependencies have already been installed:
- `axios` - For making HTTP requests to Hugging Face API

### 2. Database Migration
Run the database migration to create the `client_sentiment` table:
```bash
cd server
node migrate-sentiment-db.js
```

### 3. Environment Variables
Add the following to your `server/.env` file:
```env
# Hugging Face API Key for AI Sentiment Analysis
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
```

### 4. Get Hugging Face API Key
1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token and add it to your `.env` file

## 🖥️ Frontend Setup

### 1. Dependencies
The required dependencies have already been installed:
- `axios` - For API calls
- `recharts` - For trend charts
- `lucide-react` - For icons (already installed)

### 2. New Components Created
- `RelationshipHealthCard.tsx` - Displays sentiment in project details
- `SentimentDashboard.tsx` - Full sentiment analysis page

### 3. New Routes Added
- `/sentiment/:clientId` - Sentiment dashboard page

## 🚀 Usage

### 1. Analyze Client Sentiment
- Go to any project details page
- The "Client Relationship Health" section will show sentiment data
- Click "View Detailed Analysis" to see the full dashboard

### 2. Add New Messages for Analysis
- In the Sentiment Dashboard, use the "Analyze New Message" section
- Enter client feedback or messages
- Click "Analyze" to process with AI

### 3. View Trends
- The dashboard shows a trend chart of relationship health over time
- Monitor client satisfaction changes

## 🎨 Features

### Sentiment Analysis
- **Positive**: Green indicators, high health scores (80-100)
- **Neutral**: Yellow indicators, medium health scores (50-79)
- **Negative**: Red indicators, low health scores (0-49)

### Relationship Health Score
- Calculated based on sentiment confidence and label
- Ranges from 0-100
- Updated automatically with new messages

### Trend Tracking
- Stores up to 30 historical data points
- Shows improvement/decline trends
- Visual chart representation

### AI Summary
- Automatically generated summaries based on sentiment
- Provides actionable insights
- Updates with each analysis

## 🔧 API Endpoints

### POST `/api/ai/sentiment`
Analyze client messages for sentiment:
```json
{
  "clientId": "123",
  "messages": [
    {
      "text": "Client feedback message",
      "date": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET `/api/ai/sentiment/:clientId`
Fetch existing sentiment data for a client.

## 🎯 Integration Points

The sentiment feature automatically integrates with:
- **Project Details Page**: Shows relationship health card
- **Dashboard**: Can be extended to show overview
- **Reports**: Data available for reporting

## 🐛 Troubleshooting

### Common Issues

1. **"AI sentiment analysis service temporarily unavailable"**
   - Hugging Face API might be down
   - Check your API key is correct
   - Verify internet connection

2. **"No sentiment data available"**
   - Client hasn't been analyzed yet
   - Add a message to analyze first

3. **Database errors**
   - Ensure migration was run successfully
   - Check database connection

### Testing the Feature

1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm run dev`
3. Go to any project details page
4. Check the "Client Relationship Health" section
5. Add a test message in the sentiment dashboard

## 📊 Data Structure

The `client_sentiment` table stores:
- `client_id`: Unique client identifier
- `sentiment_label`: positive/neutral/negative
- `confidence_score`: AI confidence (0-1)
- `relationship_health_score`: Calculated score (0-100)
- `summary`: AI-generated summary
- `trend_history`: Array of historical scores
- `updated_at`: Last analysis timestamp

## 🔮 Future Enhancements

Potential improvements:
- Email integration for automatic analysis
- Slack/Teams notifications for negative sentiment
- Bulk analysis of multiple clients
- Sentiment-based client segmentation
- Integration with project milestones
