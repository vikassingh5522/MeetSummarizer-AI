export function parseJsonResponse(content) {
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Model response was empty.');
  }

  const trimmed = content.trim();
  const fencedJson = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fencedJson ? fencedJson[1].trim() : extractJsonObject(trimmed);

  return JSON.parse(candidate);
}

function extractJsonObject(content) {
  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('Model response did not contain a JSON object.');
  }

  return content.slice(firstBrace, lastBrace + 1);
}
