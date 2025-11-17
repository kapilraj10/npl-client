const KEY = "npl_matches_v1";

export function getMatches() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveMatches(matches) {
  localStorage.setItem(KEY, JSON.stringify(matches || []));
}

export function upsertMatch(match) {
  const list = getMatches();
  const idx = list.findIndex((m) => m.id === match.id);
  if (idx >= 0) list[idx] = match;
  else list.push(match);
  saveMatches(list);
}

export function deleteMatch(id) {
  const list = getMatches().filter((m) => m.id !== id);
  saveMatches(list);
}

export function generateId() {
  return Math.random().toString(36).slice(2, 9);
}
