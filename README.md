# MeetSummarizer AI

MeetSummarizer AI is a full-stack meeting transcript summarizer. It turns raw meeting transcripts into structured summaries with agenda items, decisions, action items, editable sections, saved meeting history, and RAG-style continuity from previous meetings.

The project is organized as a React + Vite frontend and an Express backend. The backend can use Mistral AI when an API key is configured, or fall back to a local mock summarizer for demo/development mode.

## Features

- Generate structured meeting summaries from transcript text.
- Extract agenda, decisions, and action items.
- Regenerate individual summary sections.
- Edit and save generated summaries.
- View, select, and delete past meetings.
- Retrieve similar previous meetings using a file-based TF-IDF similarity search.
- Run in mock LLM mode when no Mistral API key is configured.
- Health endpoint exposes whether the backend is using Mistral or mock mode.

## Tech Stack

- Frontend: React, Vite, lucide-react, CSS
- Backend: Node.js, Express, CORS, Helmet, Morgan, dotenv
- Storage: JSON file at `Backend/data/meetings.json`
- AI provider: Mistral AI, with local mock fallback

## Project Structure

```text
MeetSummarizer-AI/
  Backend/
    data/
      meetings.json
    src/
      config/
      controllers/
      middleware/
      prompts/
      routes/
      services/
      utils/
      validators/
    package.json
    .env.example
  Frontend/
    src/
      api/
      assets/
      components/
      services/
      styles/
    package.json
    .env.example
  .env.example
  README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- Optional: a Mistral API key for real AI summaries

## Environment Setup

Create a backend environment file:

```bash
copy Backend\.env.example Backend\.env
```

Then update `Backend/.env`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-small-latest
```

If `MISTRAL_API_KEY` is empty, set to `mock`, or left as a placeholder, the backend runs in demo mode with the local mock summarizer.

Create a frontend environment file:

```bash
copy Frontend\.env.example Frontend\.env
```

Expected frontend value:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Install Dependencies

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Run the App

Start the backend:

```bash
cd Backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open the frontend URL in your browser and navigate to the dashboard to generate summaries.

## Available Scripts

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Check backend status and LLM mode |
| GET | `/landing` | Get landing page content |
| POST | `/summarize` | Generate a structured summary from a transcript |
| POST | `/regenerate-section` | Regenerate one summary section |
| GET | `/meetings` | List saved meetings |
| PUT | `/meetings/:id` | Update a saved meeting summary |
| DELETE | `/meetings/:id` | Delete a saved meeting |

Example summarize request:

```bash
curl -X POST http://localhost:5000/api/summarize ^
  -H "Content-Type: application/json" ^
  -d "{\"transcript\":\"John: Today we'll discuss the Q3 release timeline. Sarah: Backend APIs are complete. Mike: Frontend work needs another week.\"}"
```

Example response shape:

```json
{
  "summary": {
    "agenda": ["Q3 release timeline"],
    "decisions": ["Release date moved from Aug 1 to Aug 8"],
    "action_items": [
      {
        "owner": "Sarah",
        "task": "Prepare deployment scripts",
        "due_date": "Friday",
        "evidence": "..."
      }
    ]
  },
  "retrievedContext": [],
  "savedMeeting": {
    "id": "meet_abc123",
    "title": "Meeting: Q3 release timeline",
    "date": "2026-06-26T..."
  }
}
```

## Data Storage

Saved meetings are stored locally in:

```text
Backend/data/meetings.json
```

The backend seeds this file with sample meetings when needed. New summaries are appended to the same file and used for future similarity retrieval.

## Notes

- Do not commit a real Mistral API key.
- The current project does not define automated test scripts.
- If the frontend cannot reach the backend, confirm `VITE_API_BASE_URL`, `PORT`, and `CORS_ORIGIN` match your local ports.
