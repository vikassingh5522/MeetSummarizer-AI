const SUMMARY_SCHEMA = `{
  "agenda": ["topic explicitly discussed"],
  "decisions": ["decision explicitly made. If a reason is explicitly stated, append 'Reason: ...' in the same string."],
  "action_items": [
    {
      "owner": "person explicitly assigned, or null",
      "task": "task explicitly assigned",
      "due_date": "deadline explicitly mentioned, or null"
    }
  ]
 }`;

const SECTION_SCHEMAS = {
  agenda: `{"agenda": ["topic explicitly discussed"]}`,
  decisions: `{"decisions": ["decision explicitly made. If a reason is explicitly stated, append 'Reason: ...' in the same string."]}`,
  action_items: `{
  "action_items": [
    {
      "owner": "person explicitly assigned, or null",
      "task": "task explicitly assigned",
      "due_date": "deadline explicitly mentioned, or null"
    }
  ]
}`
};

const SYSTEM_PROMPT = `You are a careful meeting-notes extraction engine.
Extract only facts explicitly present in the transcript.
Do not infer, guess, embellish, or add outside knowledge.
If an owner or due date is not explicitly stated, return null for that field.
If a decision includes a stated reason, include it in the same decision string using the format "Decision text. Reason: ...".
If no agenda topics, decisions, or action items are present, return an empty array for that section.
Return JSON only. Do not include markdown, commentary, or prose.`;

export function buildSummaryMessages(transcript, historicalContext = '') {
  const systemPrompt = SYSTEM_PROMPT + (historicalContext ? `\n\nUse the following historical context from past meetings as secondary context to maintain continuity. The current transcript remains the primary source of truth. Do not invent new facts beyond the transcript and historical context.` : '');
  
  const userContent = historicalContext 
    ? `Historical Context (from past meetings):
${historicalContext}

Return a meeting summary for the current transcript using exactly this JSON shape:

${SUMMARY_SCHEMA}

Current Transcript:
${transcript}`
    : `Return a meeting summary using exactly this JSON shape:

${SUMMARY_SCHEMA}

Transcript:
${transcript}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ];
}

export function buildSectionMessages(transcript, section, historicalContext = '') {
  const systemPrompt = SYSTEM_PROMPT + (historicalContext ? `\n\nUse the following historical context from past meetings as secondary context to maintain continuity. The current transcript remains the primary source of truth.` : '');
  
  const userContent = historicalContext
    ? `Historical Context (from past meetings):
${historicalContext}

Regenerate only the "${section}" section from the transcript.
Return exactly this JSON shape and no other keys:

${SECTION_SCHEMAS[section]}

Current Transcript:
${transcript}`
    : `Regenerate only the "${section}" section from the transcript.
Return exactly this JSON shape and no other keys:

${SECTION_SCHEMAS[section]}

Transcript:
${transcript}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ];
}

export function buildRepairMessages(rawContent, validationError, section = null) {
  const schema = section ? SECTION_SCHEMAS[section] : SUMMARY_SCHEMA;
  const scope = section ? `the "${section}" section` : 'the full meeting summary';

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `The previous response for ${scope} was invalid JSON or did not match the required schema.
Repair it using only the information already present in the previous response.
Do not add new facts.
Return JSON only.

Required schema:
${schema}

Validation error:
${validationError}

Previous response:
${rawContent}`
    }
  ];
}
