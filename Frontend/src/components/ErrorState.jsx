import { AlertCircle } from 'lucide-react';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel error-panel" role="alert" aria-live="assertive">
      <AlertCircle className="error-icon" aria-hidden="true" size={32} />
      <div>
        <h3>Error occurred</h3>
        <p>{message || 'Failed to complete operations.'}</p>
        {onRetry && (
          <button className="primary-button error-retry-btn" onClick={onRetry}>
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
