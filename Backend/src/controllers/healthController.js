import { env } from '../config/env.js';

export function getHealth(req, res) {
  const hasKey = !!env.mistralApiKey && 
                 env.mistralApiKey.trim() !== '' && 
                 !env.mistralApiKey.includes('your_actual_') && 
                 !env.mistralApiKey.includes('your_mistral_') &&
                 env.mistralApiKey !== 'qgsBiMnmPftSe73s5wMh1OG1xcRQPPgx' &&
                 env.mistralApiKey.toLowerCase() !== 'mock';

  res.json({
    status: 'ok',
    service: 'meet-summarizer-backend',
    llmMode: hasKey ? 'mistral' : 'mock'
  });
}


