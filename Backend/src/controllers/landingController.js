const landingContent = {
  product: {
    name: 'MeetSummarizer AI',
    tagline: 'Turn meeting transcripts into structured, editable summaries.',
    summary:
      'MeetSummarizer AI is a React and Express application that converts raw meeting notes into agenda items, decisions, and action items while preserving historical meeting context with lightweight RAG.'
  },
  stats: [
    { label: 'Core sections', value: '3', detail: 'Agenda, decisions, and action items' },
    { label: 'Memory mode', value: 'RAG', detail: 'Past meetings retrieved by TF-IDF similarity' },
    { label: 'LLM fallback', value: '2', detail: 'Mistral AI or local mock mode' }
  ],
  features: [
    'Transcript processing for meeting notes and raw discussion logs',
    'Structured agenda, decision, and action item extraction',
    'Owner and due date handling with null values when details are not mentioned',
    'Hallucination-controlled prompting and response validation',
    'RAG continuity using a pure JavaScript TF-IDF similarity engine',
    'Past meeting memory dashboard with preview and delete actions',
    'Inline editing for generated summary sections',
    'Section-level regeneration without changing the whole summary',
    'Transparent retrieval UI that shows which prior meetings were used',
    'Dark responsive dashboard with status indicators and loading states'
  ],
  about: [
    'The project is split into a React Vite frontend and an Express backend API.',
    'The backend owns prompt construction, validation, Mistral integration, mock fallback responses, RAG retrieval, and JSON file persistence.',
    'The frontend provides the dashboard, transcript input, editable summary cards, meeting history sidebar, and retrieval transparency.'
  ],
  workflow: [
    'Paste a meeting transcript or notes into the dashboard input.',
    'Generate a summary to extract agenda topics, decisions, and action items.',
    'Review retrieved historical meetings when RAG context is available.',
    'Edit, add, or delete summary items directly in the UI.',
    'Regenerate only one section when you want a more focused AI pass.',
    'Open past meetings from the sidebar to reuse saved summaries.'
  ]
};

export function getLandingContent(_req, res) {
  res.json(landingContent);
}
