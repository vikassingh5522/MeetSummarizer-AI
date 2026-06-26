import { History, Trash2, Calendar, FileText, Database } from 'lucide-react';

export function PastMeetingsList({ meetings, activeMeetingId, onSelectMeeting, onDeleteMeeting }) {
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section className="past-meetings-panel" aria-labelledby="past-meetings-heading">
      <div className="section-heading">
        <Database className="card-icon icon-rag" aria-hidden="true" size={20} />
        <div>
          <h2 id="past-meetings-heading">RAG Memory DB</h2>
          <p>Historical meetings used for similarity search.</p>
        </div>
      </div>

      <div className="meetings-list">
        {meetings && meetings.length > 0 ? (
          meetings.map((meeting) => {
            const isActive = activeMeetingId === meeting.id;
            const itemsCount = 
              (meeting.summary?.agenda?.length || 0) +
              (meeting.summary?.decisions?.length || 0) +
              (meeting.summary?.action_items?.length || 0);

            return (
              <div 
                key={meeting.id} 
                className={`meeting-list-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectMeeting(meeting)}
              >
                <div className="meeting-item-info">
                  <h4 className="meeting-item-title">{meeting.title}</h4>
                  <div className="meeting-item-meta">
                    <span>
                      <Calendar size={12} />
                      {formatDate(meeting.date)}
                    </span>
                    <span>
                      <FileText size={12} />
                      {itemsCount} items
                    </span>
                  </div>
                </div>
                <button
                  className="meeting-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${meeting.title}" from memory?`)) {
                      onDeleteMeeting(meeting.id);
                    }
                  }}
                  title="Remove from memory"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="meetings-empty-state">
            <History size={36} className="empty-icon" />
            <p>No past meetings in database.</p>
            <p className="sub-text">Add a new meeting to populate memory.</p>
          </div>
        )}
      </div>
    </section>
  );
}
