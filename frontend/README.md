# NASA Exoplanet Detection React Frontend

A modern React application for NASA exoplanet detection using machine learning analysis of stellar data.

## Features

- **Interactive Chat Interface**: Conversational interface for asking questions and getting analysis
- **Vector Analysis**: Input 122-element vectors for exoplanet detection
- **CSV File Upload**: Batch processing with drag-and-drop file uploads
- **Real-time Processing**: Live analysis with loading indicators
- **Responsive Design**: Modern UI with glassmorphism effects

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Python backend API running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`.

### Backend Integration

The frontend expects a FastAPI backend running on `http://localhost:8000`.

To start the backend:
```bash
cd ..
python backend_api.py
```

## Usage

1. **Chat Interface**: Type questions or paste 122-element vectors in the chat
2. **File Upload**: Drag and drop CSV files in the sidebar for batch analysis
3. **Clear Chat**: Use the clear button to reset the conversation

## Data Format

- **Vectors**: 122 comma-separated numerical values between 0.0 and 1.0
- **CSV Files**: Each row should contain a 122-element vector

## API Endpoints

- `POST /chat` - Process chat messages and vector analysis
- `GET /health` - Health check
- `GET /docs` - API documentation

## Components

- **App.js** - Main application component
- **ChatInterface.js** - Chat UI and message handling
- **MessageList.js** - Message display with animations
- **ChatInput.js** - Message input with keyboard shortcuts
- **Sidebar.js** - File upload and controls
- **FileUpload.js** - Drag-and-drop CSV processing

## Styling

Uses styled-components with a space-themed design:
- Glassmorphism effects
- Purple gradient backgrounds
- Smooth animations and transitions
- Responsive layout