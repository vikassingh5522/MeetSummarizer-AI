import { generateSummary, regenerateSection } from '../services/summaryService.js';

export async function summarizeTranscript(req, res, next) {
  try {
    const summary = await generateSummary(req.body?.transcript);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

export async function regenerateSummarySection(req, res, next) {
  try {
    const sectionSummary = await regenerateSection(req.body?.transcript, req.body?.section);
    res.json(sectionSummary);
  } catch (error) {
    next(error);
  }
}
