import { useEffect, useState } from 'react';
import { AgendaSection } from './AgendaSection';
import { DecisionsSection } from './DecisionsSection';
import { ActionItemsSection } from './ActionItemsSection';
import { Sparkles, BrainCircuit, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export function SummaryView({
  summary,
  meetingId,
  meetingTitle,
  meetingDate,
  retrievedContext = [],
  onUpdateSection,
  onRegenerateSection,
  isRegeneratingSection
}) {
  const [showRetrievedContext, setShowRetrievedContext] = useState(false);

  useEffect(() => {
    setShowRetrievedContext(false);
  }, [meetingId, retrievedContext.length]);

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
          <div className="rag-header-row">
            <div className="rag-header">
              <BrainCircuit className="rag-icon" size={18} />
              <h4>Retrieval-Augmented Generation (RAG) Active</h4>
            </div>
            <button
              type="button"
              className="rag-toggle-button"
              onClick={() => setShowRetrievedContext((value) => !value)}
            >
              {showRetrievedContext ? (
                <>
                  <ChevronUp size={14} />
                  <span>Hide retrieved meetings</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>View retrieved meetings</span>
                </>
              )}
            </button>
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
          {showRetrievedContext && (
            <div className="rag-detail-list">
              {retrievedContext.map((context) => {
                const agenda = context.summary?.agenda || [];
                const decisions = context.summary?.decisions || [];
                const actionItems = context.summary?.action_items || [];

                return (
                  <article key={context.id} className="rag-detail-card">
                    <div className="rag-detail-header">
                      <div>
                        <h5>{context.title}</h5>
                        <p>
                          {new Date(context.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className="rag-detail-count">
                        {agenda.length + decisions.length + actionItems.length} items
                      </span>
                    </div>

                    <div className="rag-detail-columns">
                      <div>
                        <span className="rag-detail-label">Agenda</span>
                        <ul>
                          {agenda.slice(0, 2).map((item, index) => (
                            <li key={`${context.id}-agenda-${index}`}>{item}</li>
                          ))}
                          {agenda.length > 2 && <li>+{agenda.length - 2} more</li>}
                        </ul>
                      </div>

                      <div>
                        <span className="rag-detail-label">Decisions</span>
                        <ul>
                          {decisions.slice(0, 2).map((item, index) => (
                            <li key={`${context.id}-decision-${index}`}>{item}</li>
                          ))}
                          {decisions.length > 2 && <li>+{decisions.length - 2} more</li>}
                        </ul>
                      </div>

                      <div>
                        <span className="rag-detail-label">Action items</span>
                        <ul>
                          {actionItems.slice(0, 2).map((item, index) => (
                            <li key={`${context.id}-action-${index}`}>
                              {item.owner ? `${item.owner}: ` : ''}
                              {item.task}
                              {item.due_date ? ` (Due ${item.due_date})` : ''}
                            </li>
                          ))}
                          {actionItems.length > 2 && <li>+{actionItems.length - 2} more</li>}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
