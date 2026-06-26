import { useState, useEffect } from 'react';
import { FileText, Sparkles, Brain, Plus, Eraser } from 'lucide-react';
import { TranscriptInput } from './components/TranscriptInput';
import { SummaryView } from './components/SummaryView';
import { PastMeetingsList } from './components/PastMeetingsList';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import * as summaryApi from './api/summaryApi';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active meeting stats
  const [summary, setSummary] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(null);
  const [retrievedContext, setRetrievedContext] = useState([]);

  // Sidebar past meetings
  const [pastMeetings, setPastMeetings] = useState([]);
  
  // LLM Connection status
  const [llmMode, setLlmMode] = useState('mock'); // 'mistral' or 'mock'
  
  // Section regeneration states
  const [isRegeneratingSection, setIsRegeneratingSection] = useState({
    agenda: false,
    decisions: false,
    action_items: false
  });

  // Fetch past meetings and health status on load
  useEffect(() => {
    checkHealth();
    loadMeetings();
  }, []);

  const checkHealth = async () => {
    try {
      const data = await summaryApi.getHealth();
      if (data && data.llmMode) {
        setLlmMode(data.llmMode);
      }
    } catch (err) {
      console.error('Failed to check backend health status:', err);
      setLlmMode('mock');
    }
  };

  const loadMeetings = async () => {
    try {
      const data = await summaryApi.getMeetings();
      setPastMeetings(data || []);
    } catch (err) {
      console.error('Failed to load past meetings:', err);
    }
  };


  const handleGenerateSummary = async (e) => {
    if (e) e.preventDefault();
    if (!transcript.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);
    setMeetingId(null);
    setRetrievedContext([]);

    try {
      const result = await summaryApi.generateSummary(transcript);
      
      setSummary(result.summary);
      setMeetingId(result.savedMeeting.id);
      setMeetingTitle(result.savedMeeting.title);
      setMeetingDate(result.savedMeeting.date);
      setRetrievedContext(result.retrievedContext || []);
      
      // Reload sidebar
      await loadMeetings();
    } catch (err) {
      setError(err.message || 'Failed to generate meeting summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSummary(meeting.summary);
    setMeetingId(meeting.id);
    setMeetingTitle(meeting.title);
    setMeetingDate(meeting.date);
    setTranscript(meeting.transcript || '');
    setRetrievedContext([]); // No active RAG retrieval status for historical viewing
    setError(null);
  };

  const handleDeleteMeeting = async (id) => {
    try {
      await summaryApi.deleteMeeting(id);
      await loadMeetings();
      if (meetingId === id) {
        handleReset();
      }
    } catch (err) {
      alert('Failed to delete meeting: ' + err.message);
    }
  };

  const handleUpdateSection = async (section, updatedItems) => {
    if (!summary || !meetingId) return;

    const updatedSummary = {
      ...summary,
      [section]: updatedItems
    };

    // Update local UI state
    setSummary(updatedSummary);

    try {
      // Save updates to database
      await summaryApi.updateMeeting(meetingId, updatedSummary);
      // Reload list to update stats
      await loadMeetings();
    } catch (err) {
      console.error('Failed to save meeting edits:', err);
      alert('Failed to save changes to database: ' + err.message);
    }
  };

  const handleRegenerateSection = async (section) => {
    if (!transcript.trim()) return;

    setIsRegeneratingSection(prev => ({ ...prev, [section]: true }));

    try {
      const result = await summaryApi.regenerateSection(transcript, section);
      
      // Result is in the form: { [section]: ... }
      const updatedItems = result[section];
      const updatedSummary = {
        ...summary,
        [section]: updatedItems
      };

      setSummary(updatedSummary);

      // Save if we have an active meeting ID
      if (meetingId) {
        await summaryApi.updateMeeting(meetingId, updatedSummary);
        await loadMeetings();
      }
    } catch (err) {
      alert(`Failed to regenerate ${section}: ` + err.message);
    } finally {
      setIsRegeneratingSection(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleReset = () => {
    setSummary(null);
    setMeetingId(null);
    setMeetingTitle('');
    setMeetingDate(null);
    setTranscript('');
    setRetrievedContext([]);
    setError(null);
  };

  return (
    <main className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <Brain className="brand-logo" size={32} />
          <div>
            <h1>MeetSummarizer AI</h1>
            <p>Smart Structured Summaries with RAG Continuity</p>
          </div>
        </div>

        <div className="header-status-badge">
          {llmMode === 'mistral' ? (
            <div className="badge badge-success" title="The server has a valid Mistral API key configured.">
              <Sparkles size={14} className="badge-icon animate-pulse" />
              <span>Mistral AI Connected</span>
            </div>
          ) : (
            <div className="badge badge-warning" title="MISTRAL_API_KEY is not configured in Backend/.env. Running with a local mock LLM fallback.">
              <Sparkles size={14} className="badge-icon" />
              <span>Demo Mode (Mock LLM)</span>
            </div>
          )}
        </div>

        {summary && (
          <button className="secondary-button clear-btn" onClick={handleReset}>
            <Plus size={16} />
            <span>New Summary</span>
          </button>
        )}
      </header>

      {/* Main Grid Layout */}
      <div className="app-content-grid">
        {/* Sidebar RAG Database */}
        <aside className="app-sidebar">
          <PastMeetingsList
            meetings={pastMeetings}
            activeMeetingId={meetingId}
            onSelectMeeting={handleSelectMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        </aside>

        {/* Content Pane */}
        <section className="app-main-pane">
          {!summary && !isLoading && !error && (
            <div className="input-state-pane">
              <TranscriptInput
                transcript={transcript}
                onTranscriptChange={setTranscript}
                onSubmit={handleGenerateSummary}
                isLoading={isLoading}
              />
              
              {transcript.trim() && (
                <button className="clear-text-btn" onClick={() => setTranscript('')}>
                  <Eraser size={14} />
                  <span>Clear Input</span>
                </button>
              )}
            </div>
          )}

          {isLoading && <LoadingState />}

          {error && <ErrorState message={error} onRetry={handleGenerateSummary} />}

          {summary && !isLoading && (
            <SummaryView
              summary={summary}
              meetingId={meetingId}
              meetingTitle={meetingTitle}
              meetingDate={meetingDate}
              retrievedContext={retrievedContext}
              onUpdateSection={handleUpdateSection}
              onRegenerateSection={handleRegenerateSection}
              isRegeneratingSection={isRegeneratingSection}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
