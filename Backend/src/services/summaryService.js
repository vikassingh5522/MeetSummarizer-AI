import { buildRepairMessages, buildSectionMessages, buildSummaryMessages } from '../prompts/summaryPrompt.js';
import { parseJsonResponse } from '../utils/parseJsonResponse.js';
import { normalizeSectionResponse, normalizeSummary, validateSectionName } from '../validators/summarySchema.js';
import { callMistral } from './llmService.js';
import { normalizeTranscript, findSentenceEvidence } from './transcriptService.js';
import { searchSimilarMeetings, formatHistoricalContext, saveMeeting } from './ragService.js';

export async function generateSummary(rawTranscript) {
  const transcript = normalizeTranscript(rawTranscript);
  
  // Retrieve similar past meetings (RAG)
  const similarMeetings = searchSimilarMeetings(transcript, 2);
  const contextString = formatHistoricalContext(similarMeetings);
  
  const rawContent = await callMistral(buildSummaryMessages(transcript, contextString));

  const summary = await parseAndValidateWithRepair({
    rawContent,
    validate: normalizeSummary
  });

  // Find and attach evidence from transcript
  if (summary && summary.action_items) {
    summary.action_items = summary.action_items.map(item => ({
      ...item,
      evidence: item.evidence || findSentenceEvidence(transcript, item.task)
    }));
  }

  // Save this meeting to past meetings database
  const savedMeeting = saveMeeting(transcript, summary);

  return {
    summary,
    retrievedContext: similarMeetings.map(m => ({
      id: m.id,
      title: m.title,
      date: m.date,
      summary: m.summary
    })),
    savedMeeting: {
      id: savedMeeting.id,
      title: savedMeeting.title,
      date: savedMeeting.date
    }
  };
}

export async function regenerateSection(rawTranscript, section) {
  const transcript = normalizeTranscript(rawTranscript);
  const safeSection = validateSectionName(section);
  
  // Retrieve similar past meetings (RAG)
  const similarMeetings = searchSimilarMeetings(transcript, 2);
  const contextString = formatHistoricalContext(similarMeetings);
  
  const rawContent = await callMistral(buildSectionMessages(transcript, safeSection, contextString));

  const result = await parseAndValidateWithRepair({
    rawContent,
    section: safeSection,
    validate: (value) => normalizeSectionResponse(value, safeSection)
  });

  if (safeSection === 'action_items' && result && result.action_items) {
    result.action_items = result.action_items.map(item => ({
      ...item,
      evidence: item.evidence || findSentenceEvidence(transcript, item.task)
    }));
  }

  return result;
}

async function parseAndValidateWithRepair({ rawContent, validate, section = null }) {
  try {
    return validate(parseJsonResponse(rawContent));
  } catch (error) {
    const repairedContent = await callMistral(buildRepairMessages(rawContent, error.message, section), {
      temperature: 0
    });

    return validate(parseJsonResponse(repairedContent));
  }
}

