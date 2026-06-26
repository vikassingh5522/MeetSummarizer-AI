import { FileText, WandSparkles } from 'lucide-react';

export function TranscriptInput({ transcript, onTranscriptChange, onSubmit, isLoading }) {
  return (
    <section className="transcript-panel" aria-labelledby="transcript-heading">
      <div className="section-heading">
        <FileText aria-hidden="true" size={20} />
        <div>
          <h2 id="transcript-heading">Transcript</h2>
          <p>Paste meeting notes or a raw transcript.</p>
        </div>
      </div>

      <form className="transcript-form" onSubmit={onSubmit}>
        <textarea
          value={transcript}
          onChange={(event) => onTranscriptChange(event.target.value)}
          placeholder="John: Today we'll discuss the Q3 release timeline..."
          aria-label="Meeting transcript"
          disabled={isLoading}
        />
        <button className="primary-button" type="submit" disabled={isLoading || !transcript.trim()}>
          <WandSparkles aria-hidden="true" size={18} />
          {isLoading ? 'Generating' : 'Generate Summary'}
        </button>
      </form>
    </section>
  );
}
