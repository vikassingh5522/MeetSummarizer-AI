const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function generateSummary(transcript) {
  return apiRequest('/summarize', {
    method: 'POST',
    body: JSON.stringify({ transcript })
  });
}

export async function regenerateSection(transcript, section) {
  return apiRequest('/regenerate-section', {
    method: 'POST',
    body: JSON.stringify({ transcript, section })
  });
}

export async function getMeetings() {
  return apiRequest('/meetings', {
    method: 'GET'
  });
}

export async function updateMeeting(id, summary) {
  return apiRequest(`/meetings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ summary })
  });
}

export async function deleteMeeting(id) {
  return apiRequest(`/meetings/${id}`, {
    method: 'DELETE'
  });
}

export async function getHealth() {
  return apiRequest('/health', {
    method: 'GET'
  });
}



async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
