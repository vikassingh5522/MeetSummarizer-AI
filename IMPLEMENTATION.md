# Smart Meeting Summary Generator Implementation Plan

## Goal

Build a full-stack meeting summarizer with a React frontend and Node.js backend. Users paste meeting notes or transcripts, the backend sends the transcript to Mistral AI, and the app returns a structured summary with agenda topics, key decisions, and action items.

## Architecture

- `Frontend/`: React + Vite single-page app.
- `Backend/`: Node.js + Express API server.
- Mistral API key stays server-side in `.env`.
- The frontend only talks to the backend API.

## Backend Work

1. Keep the existing Express app structure.
2. Add routes:
   - `GET /api/health`
   - `POST /api/summarize`
   - `POST /api/regenerate-section`
3. Add service modules:
   - `transcriptService.js` for transcript normalization and validation.
   - `llmService.js` for Mistral API calls.
   - `summaryService.js` for summary and section regeneration workflows.
4. Add prompt module:
   - `summaryPrompt.js` with hallucination-safe instructions.
5. Add validator module:
   - `summarySchema.js` to validate and normalize generated JSON.
6. Add JSON parsing utility:
   - `parseJsonResponse.js` to handle fenced or plain JSON model responses.
7. Retry once with a stricter repair prompt if Mistral returns invalid JSON.
8. Return empty arrays and `null` missing values instead of invented details.

## Frontend Work

1. Replace the placeholder React screen with the working summarizer UI.
2. Add components:
   - `TranscriptInput.jsx`
   - `SummaryView.jsx`
   - `AgendaSection.jsx`
   - `DecisionsSection.jsx`
   - `ActionItemsSection.jsx`
   - `LoadingState.jsx`
   - `ErrorState.jsx`
3. Add API module:
   - `summaryApi.js`
4. Support:
   - Large transcript textarea.
   - Generate Summary button.
   - Loading and error states.
   - Editable agenda, decisions, and action items.
   - Regenerate button for each section.
   - Display missing due dates as `No due date mentioned`.

## Hallucination Controls

- Prompt requires extraction only from explicit transcript content.
- Prompt forbids invented owners, deadlines, decisions, or action items.
- Backend validates and normalizes JSON before sending it to the frontend.
- Missing `owner` and `due_date` values are returned as `null`.
- README documents this behavior clearly.

## Documentation

Add or update:

- `README.md` with setup, architecture, API usage, and demo transcript.
- Root `.env.example` with required server and client environment variables.
- Backend and frontend `.env.example` files.

## Verification

1. Run backend syntax/import checks.
2. Run frontend build.
3. Test API validation behavior for empty transcript.
4. Test health endpoint.
5. Manually verify with this transcript:

```text
John: Today we'll discuss the Q3 release timeline.
Sarah: Backend APIs are complete.
Mike: Frontend work needs another week.
John: Let's move the release date from Aug 1 to Aug 8.
Sarah: I'll prepare deployment scripts by Friday.
Mike: I'll finish UI testing by Aug 5.
```

Expected result:

- Agenda includes Q3 release timeline.
- Decisions include release date moved from Aug 1 to Aug 8.
- Action items include Sarah and Mike.
- Due dates are Friday and Aug 5.

## Future Work

- Add audio transcription.
- Store previous summaries.
- Add retrieval-augmented generation with a local vector database.
- Use retrieved historical context only as secondary context; the current transcript remains the source of truth.
