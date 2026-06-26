import { createHttpError } from '../utils/httpError.js';

const MAX_TRANSCRIPT_CHARS = 80000;

export function normalizeTranscript(transcript) {
  if (typeof transcript !== 'string') {
    throw createHttpError(400, 'Transcript must be a string.');
  }

  const normalized = transcript.trim();

  if (!normalized) {
    throw createHttpError(400, 'Transcript is required.');
  }

  if (normalized.length > MAX_TRANSCRIPT_CHARS) {
    throw createHttpError(413, `Transcript is too long. Limit is ${MAX_TRANSCRIPT_CHARS} characters.`);
  }

  return normalized;
}

export function findSentenceEvidence(transcript, task) {
  if (!transcript || !task) return null;
  
  // Clean task up for search
  const cleanTask = task.replace(/[^\w\s]/g, ' ').toLowerCase();
  const taskWords = cleanTask.split(/\s+/).filter(w => w.length > 2);
  
  if (taskWords.length === 0) return null;

  // Split transcript into sentences/lines
  const sentences = [];
  const lines = transcript.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    // If it has a speaker prefix, extract the text but keep the line for reference
    const content = line.includes(':') ? line.split(':').slice(1).join(':').trim() : line;
    const contentSentences = content.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    for (const cs of contentSentences) {
      sentences.push({
        rawLine: line,
        sentenceText: cs
      });
    }
  }

  let bestScore = 0;
  let bestSentence = null;

  for (const item of sentences) {
    const cleanSentence = item.sentenceText.replace(/[^\w\s]/g, ' ').toLowerCase();
    let overlapCount = 0;
    for (const word of taskWords) {
      if (cleanSentence.includes(word)) {
        overlapCount++;
      }
    }
    const score = overlapCount / Math.max(taskWords.length, 1);
    if (score > bestScore) {
      bestScore = score;
      bestSentence = item.rawLine;
    }
  }

  // Return the sentence if we have at least 30% keyword overlap
  return bestScore >= 0.3 ? bestSentence : null;
}

