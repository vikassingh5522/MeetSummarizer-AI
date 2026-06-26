import { AgendaSection } from './AgendaSection';
import { DecisionsSection } from './DecisionsSection';
import { ActionItemsSection } from './ActionItemsSection';
import { Sparkles, BrainCircuit, ExternalLink, Calendar } from 'lucide-react';

export function SummaryView({
  summary,
  meetingId,
  meetingTitle,
  meetingDate,
  retrievedContext,
  onUpdateSection,
  onRegenerateSection,
  isRegeneratingSection
}) {
  if (!summary) return null;

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="summary-view-container">
      {/* Summary Header */}
      <div className="summary-view-header">
        <div className="header-meta">
          <Sparkles className="header-icon" size={24} />
          <div>
            <h2>{meetingTitle || 'Generated Meeting Summary'}</h2>
            {meetingDate && (
              <span className="summary-date">
                <Calendar size={14} />
                {formatDate(meetingDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RAG Context Display */}
      {retrievedContext && retrievedContext.length > 0 && (
        <div className="rag-context-card">
          <div className="rag-header">
            <BrainCircuit className="rag-icon" size={18} />
            <h4>Retrieval-Augmented Generation (RAG) Active</h4>
          </div>
          <p className="rag-description">
            Injected historical context from past meetings to maintain topic continuity:
          </p>
          <div className="rag-pills">
            {retrievedContext.map((context) => (
              <div key={context.id} className="rag-pill">
                <span className="pill-title">{context.title}</span>
                <span className="pill-divider" />
                <span className="pill-date">
                  {new Date(context.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Sections */}
      <div className="summary-sections-grid">
        <AgendaSection
          items={summary.agenda}
          onUpdate={(items) => onUpdateSection('agenda', items)}
          onRegenerate={() => onRegenerateSection('agenda')}
          isRegenerating={isRegeneratingSection.agenda}
        />

        <DecisionsSection
          items={summary.decisions}
          onUpdate={(items) => onUpdateSection('decisions', items)}
          onRegenerate={() => onRegenerateSection('decisions')}
          isRegenerating={isRegeneratingSection.decisions}
        />

        <ActionItemsSection
          items={summary.action_items}
          onUpdate={(items) => onUpdateSection('action_items', items)}
          onRegenerate={() => onRegenerateSection('action_items')}
          isRegenerating={isRegeneratingSection.action_items}
        />
      </div>
    </div>
  );
}
