import { env } from '../config/env.js';
import { createHttpError } from '../utils/httpError.js';
import { generateMockSummary, generateMockSection } from './mockLlmService.js';

const MISTRAL_CHAT_COMPLETIONS_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function callMistral(messages, options = {}) {
  const isMock = !env.mistralApiKey || 
                 env.mistralApiKey.trim() === '' || 
                 env.mistralApiKey.includes('your_actual_') || 
                 env.mistralApiKey.includes('your_mistral_') ||
                 env.mistralApiKey === 'qgsBiMnmPftSe73s5wMh1OG1xcRQPPgx' ||
                 env.mistralApiKey.toLowerCase() === 'mock';

  if (isMock) {
    console.warn('⚠️ MISTRAL_API_KEY is not configured or is a placeholder. Using Mock/Demo LLM Service.');
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    // Check if it's a section regeneration request
    const sectionMatch = userMessage.match(/Regenerate only the "(agenda|decisions|action_items)" section/);
    
    // Extract transcript
    let transcript = '';
    const transcriptMatch = userMessage.match(/(?:Current )?Transcript:\s*([\s\S]*)$/i);
    if (transcriptMatch) {
      // If we matched the transcript, clean up the end of it (e.g. if it had trailing text, though in prompts it's at the end)
      transcript = transcriptMatch[1].trim();
    } else {
      transcript = userMessage;
    }

    if (sectionMatch) {
      const section = sectionMatch[1];
      return generateMockSection(transcript, section);
    }
    
    // Check if it's a repair request
    if (userMessage.includes('The previous response') && userMessage.includes('was invalid JSON')) {
      const previousResponseMatch = userMessage.match(/Previous response:\s*([\s\S]*)$/i);
      if (previousResponseMatch) {
        return previousResponseMatch[1].trim();
      }
      return generateMockSummary(transcript);
    }

    return generateMockSummary(transcript);
  }

  const response = await fetch(MISTRAL_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.mistralApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.mistralModel,
      messages,
      temperature: options.temperature ?? 0.1,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw createHttpError(response.status, `Mistral API request failed: ${detail || response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw createHttpError(502, 'Mistral returned an empty response.');
  }

  return content;
}

