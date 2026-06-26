import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'meetings.json');

// Stop words for basic TF-IDF
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function getTermFrequency(words) {
  const tf = {};
  words.forEach(word => {
    tf[word] = (tf[word] || 0) + 1;
  });
  return tf;
}

let meetingsCache = null;

export function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seedMeetings = [
      {
        id: 'seed-1',
        title: 'Project Kickoff & Tech Stack Decision',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transcript: 'John: Let\'s kickoff the Smart Meeting Summary project.\nSarah: What is the tech stack?\nJohn: We will use Node.js and Express for the backend, and React for the frontend.\nMike: Let\'s use TailwindCSS for styling if possible, but keep vanilla CSS as fallback. For AI, we\'ll use Mistral AI.\nSarah: I will setup the repo and backend structure.',
        summary: {
          agenda: ['Project kickoff', 'Tech stack discussion'],
          decisions: ['Use Node.js, Express, and React', 'Use Mistral AI for AI features'],
          action_items: [
            { owner: 'Sarah', task: 'Setup the repo and backend structure', due_date: 'Friday' }
          ]
        }
      },
      {
        id: 'seed-2',
        title: 'UI Design Sync & Setup',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        transcript: 'John: Let\'s review UI progress.\nMike: I have setup the React structure with Vite. I will build the initial components by Tuesday.\nSarah: The backend APIs for summarization are ready, but we need to implement RAG next.\nJohn: We\'ll implement a file-based RAG using TF-IDF for cosine similarity to find relevant meetings. Let\'s aim to complete the integration by Friday.',
        summary: {
          agenda: ['UI progress review', 'RAG implementation planning'],
          decisions: ['Use file-based RAG with TF-IDF and cosine similarity'],
          action_items: [
            { owner: 'Mike', task: 'Build initial React components', due_date: 'Tuesday' },
            { owner: 'Sarah', task: 'Implement RAG backend integration', due_date: 'Friday' }
          ]
        }
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedMeetings, null, 2), 'utf-8');
    meetingsCache = seedMeetings;
  }
}

export function getAllMeetings() {
  ensureDataFile();
  if (!meetingsCache) {
    meetingsCache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  return meetingsCache;
}

export function saveMeeting(transcript, summary) {
  ensureDataFile();
  if (!meetingsCache) {
    meetingsCache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const topic = summary.agenda && summary.agenda[0] ? summary.agenda[0] : 'General Discussion';
  const title = `Meeting: ${topic} (${dateStr})`;

  const newMeeting = {
    id: 'meet_' + Math.random().toString(36).substr(2, 9),
    title,
    date: new Date().toISOString(),
    transcript,
    summary
  };

  meetingsCache.push(newMeeting);
  fs.writeFileSync(DATA_FILE, JSON.stringify(meetingsCache, null, 2), 'utf-8');
  return newMeeting;
}

export function updateMeetingSummary(id, updatedSummary) {
  ensureDataFile();
  if (!meetingsCache) {
    meetingsCache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }

  const index = meetingsCache.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Meeting not found.');
  }

  meetingsCache[index].summary = updatedSummary;
  fs.writeFileSync(DATA_FILE, JSON.stringify(meetingsCache, null, 2), 'utf-8');
  return meetingsCache[index];
}

export function deleteMeeting(id) {
  ensureDataFile();
  if (!meetingsCache) {
    meetingsCache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }

  const filtered = meetingsCache.filter(m => m.id !== id);
  if (filtered.length === meetingsCache.length) {
    throw new Error('Meeting not found.');
  }

  meetingsCache = filtered;
  fs.writeFileSync(DATA_FILE, JSON.stringify(meetingsCache, null, 2), 'utf-8');
  return true;
}

export function searchSimilarMeetings(queryText, limit = 2) {
  const meetings = getAllMeetings();
  if (meetings.length === 0) {
    return [];
  }

  const queryWords = tokenize(queryText);
  if (queryWords.length === 0) {
    return [];
  }

  const queryTF = getTermFrequency(queryWords);

  // Calculate DF (Document Frequency) for all words in the collection
  const df = {};
  const allDocsWords = meetings.map(m => tokenize(`${m.title} ${m.transcript} ${JSON.stringify(m.summary)}`));
  const numDocs = meetings.length;

  allDocsWords.forEach(words => {
    const uniqueWords = new Set(words);
    uniqueWords.forEach(word => {
      df[word] = (df[word] || 0) + 1;
    });
  });

  // Calculate IDF
  const idf = {};
  Object.keys(df).forEach(word => {
    idf[word] = Math.log(1 + numDocs / df[word]);
  });

  // TF-IDF vector helper
  function getTFIDFVector(tf) {
    const vector = {};
    Object.keys(tf).forEach(word => {
      const wordIDF = idf[word] || Math.log(1 + numDocs);
      vector[word] = tf[word] * wordIDF;
    });
    return vector;
  }

  const queryVector = getTFIDFVector(queryTF);
  
  const results = meetings.map(doc => {
    const docWords = tokenize(`${doc.title} ${doc.transcript} ${JSON.stringify(doc.summary)}`);
    const docTF = getTermFrequency(docWords);
    const docVector = getTFIDFVector(docTF);

    let dotProduct = 0;
    let queryNorm = 0;
    let docNorm = 0;

    const vocab = new Set([...Object.keys(queryVector), ...Object.keys(docVector)]);
    vocab.forEach(word => {
      const qVal = queryVector[word] || 0;
      const dVal = docVector[word] || 0;
      dotProduct += qVal * dVal;
      queryNorm += qVal * qVal;
      docNorm += dVal * dVal;
    });

    queryNorm = Math.sqrt(queryNorm);
    docNorm = Math.sqrt(docNorm);

    const similarity = (queryNorm && docNorm) ? (dotProduct / (queryNorm * docNorm)) : 0;

    return {
      meeting: doc,
      similarity
    };
  });

  return results
    .filter(r => r.similarity > 0.02) // small threshold to avoid irrelevant matches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(r => r.meeting);
}

export function formatHistoricalContext(meetings) {
  if (!meetings || meetings.length === 0) {
    return '';
  }

  return meetings.map((m, index) => {
    const agendaText = m.summary.agenda.map(a => `- ${a}`).join('\n') || '- None';
    const decisionsText = m.summary.decisions.map(d => `- ${d}`).join('\n') || '- None';
    const actionText = m.summary.action_items.map(a => `- ${a.owner || 'Anyone'}: ${a.task} ${a.due_date ? `(Due ${a.due_date})` : ''}`).join('\n') || '- None';
    
    return `Past Meeting #${index + 1}: ${m.title}
Agenda:
${agendaText}
Key Decisions:
${decisionsText}
Action Items:
${actionText}`;
  }).join('\n\n');
}
