import { FileText } from 'lucide-react';

function App() {
  return (
    <main className="app-shell">
      <section className="app-header">
        <FileText aria-hidden="true" size={28} />
        <div>
          <h1>MeetSummarizer AI</h1>
          <p>Frontend scaffold is ready for React features.</p>
        </div>
      </section>
    </main>
  );
}

export default App;

