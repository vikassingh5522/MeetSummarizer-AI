export function LoadingState() {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>Generating structured summary...</p>
    </div>
  );
}
