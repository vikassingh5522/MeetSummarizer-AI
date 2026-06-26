import { createHttpError } from '../utils/httpError.js';

const VALID_SECTIONS = new Set(['agenda', 'decisions', 'action_items']);

export function validateSectionName(section) {
  if (!VALID_SECTIONS.has(section)) {
    throw createHttpError(400, 'Section must be one of: agenda, decisions, action_items.');
  }

  return section;
}

export function normalizeSummary(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Summary must be a JSON object.');
  }

  return {
    agenda: normalizeStringArray(value.agenda),
    decisions: normalizeStringArray(value.decisions),
    action_items: normalizeActionItems(value.action_items)
  };
}

export function normalizeSectionResponse(value, section) {
  validateSectionName(section);

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Section response must be a JSON object.');
  }

  if (!(section in value)) {
    throw new Error(`Section response must include "${section}".`);
  }

  if (section === 'action_items') {
    return { [section]: normalizeActionItems(value[section]) };
  }

  return { [section]: normalizeStringArray(value[section]) };
}

function normalizeStringArray(value) {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error('Expected an array of strings.');
  }

  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeActionItems(value) {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error('Expected action_items to be an array.');
  }

  return value
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({
      owner: normalizeNullableString(item.owner),
      task: normalizeRequiredString(item.task),
      due_date: normalizeNullableString(item.due_date),
      evidence: normalizeNullableString(item.evidence)
    }))
    .filter((item) => item.task);
}

function normalizeRequiredString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeNullableString(value) {
  if (value == null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
