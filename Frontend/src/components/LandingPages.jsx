import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  Layers3,
  ListChecks,
  MessageSquareText,
  Moon,
  PenLine,
  Route,
  ShieldCheck,
  Sparkles,
  Sun
} from 'lucide-react';

const featureIcons = [
  MessageSquareText,
  Layers3,
  Clock3,
  ShieldCheck,
  Database,
  FileText,
  PenLine,
  Sparkles,
  Route,
  ListChecks
];

export const fallbackLandingContent = {
  product: {
    name: 'MeetSummarizer AI',
    tagline: 'Turn meeting transcripts into structured, editable summaries.',
    summary:
      'Paste meeting notes, generate agenda items, decisions, and action items, then keep every meeting connected through lightweight RAG memory.'
  },
  stats: [
    { label: 'Core sections', value: '3', detail: 'Agenda, decisions, and action items' },
    { label: 'Memory mode', value: 'RAG', detail: 'Past meetings retrieved by similarity' },
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

export function LandingPages({ activePage, content, theme, onNavigate, onToggleTheme }) {
  const pageContent = content || fallbackLandingContent;

  return (
    <main className="landing-shell">
      <LandingNav
        activePage={activePage}
        theme={theme}
        onNavigate={onNavigate}
        onToggleTheme={onToggleTheme}
      />
      {activePage === 'home' && <HomePage content={pageContent} onNavigate={onNavigate} />}
      {activePage === 'about' && <AboutPage content={pageContent} />}
      {activePage === 'how-to' && <HowToPage content={pageContent} onNavigate={onNavigate} />}
    </main>
  );
}

function LandingNav({ activePage, theme, onNavigate, onToggleTheme }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how-to', label: 'How To Use' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <header className="landing-nav">
      <button className="landing-brand" onClick={() => onNavigate('home')} type="button">
        <Brain size={26} />
        <span>MeetSummarizer AI</span>
      </button>

      <nav className="landing-nav-links" aria-label="Main navigation">
        {navItems.map(item => (
          <button
            className={activePage === item.id ? 'nav-link active' : 'nav-link'}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <button className="theme-toggle" onClick={onToggleTheme} type="button">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </nav>
    </header>
  );
}

function HomePage({ content, onNavigate }) {
  return (
    <>
      <section className="landing-hero">
        <div className="hero-content">
          <p className="landing-eyebrow">AI meeting intelligence with memory</p>
          <h1>{content.product.name}</h1>
          <p className="hero-lede">{content.product.tagline}</p>
          <p className="hero-copy">{content.product.summary}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('dashboard')} type="button">
              <span>Open Dashboard</span>
              <ArrowRight size={16} />
            </button>
            <button className="secondary-button" onClick={() => onNavigate('how-to')} type="button">
              <span>See How It Works</span>
            </button>
          </div>
        </div>

        <div className="hero-preview" aria-label="Product summary preview">
          <div className="preview-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-grid">
            <PreviewBlock icon={FileText} title="Agenda" text="Q3 release timeline, API readiness, UI testing status" />
            <PreviewBlock icon={ShieldCheck} title="Decision" text="Release date moved from Aug 1 to Aug 8" />
            <PreviewBlock icon={ListChecks} title="Action" text="Sarah prepares deployment scripts by Friday" />
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-title-row">
          <div>
            <p className="landing-eyebrow">Project features</p>
            <h2>Everything implemented in the product</h2>
          </div>
          <button className="secondary-button" onClick={() => onNavigate('about')} type="button">
            <span>Project Details</span>
          </button>
        </div>
        <div className="feature-grid">
          {content.features.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <article className="feature-card" key={feature}>
                <Icon size={20} />
                <p>{feature}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="stats-band">
        {content.stats.map(stat => (
          <div className="stat-item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <p>{stat.detail}</p>
          </div>
        ))}
      </section>
    </>
  );
}

function AboutPage({ content }) {
  return (
    <section className="content-page">
      <p className="landing-eyebrow">About the project</p>
      <h1>Built for structured summaries, trusted extraction, and meeting memory.</h1>
      <div className="about-grid">
        {content.about.map(item => (
          <article className="about-panel" key={item}>
            <CheckCircle2 size={22} />
            <p>{item}</p>
          </article>
        ))}
      </div>
      <div className="architecture-band">
        <div>
          <Brain size={26} />
          <h2>React frontend</h2>
          <p>Dashboard, transcript input, summary cards, inline editors, and meeting history navigation.</p>
        </div>
        <ArrowRight size={22} />
        <div>
          <Database size={26} />
          <h2>Express backend</h2>
          <p>API routes, validation, RAG retrieval, Mistral or mock LLM mode, and JSON persistence.</p>
        </div>
      </div>
    </section>
  );
}

function HowToPage({ content, onNavigate }) {
  return (
    <section className="content-page">
      <p className="landing-eyebrow">How to use this tool</p>
      <h1>From raw transcript to saved meeting summary in a few steps.</h1>
      <div className="workflow-list">
        {content.workflow.map((step, index) => (
          <article className="workflow-step" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{step}</p>
          </article>
        ))}
      </div>
      <button className="primary-button how-to-cta" onClick={() => onNavigate('dashboard')} type="button">
        <span>Start Summarizing</span>
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

function PreviewBlock({ icon: Icon, title, text }) {
  return (
    <div className="preview-block">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
