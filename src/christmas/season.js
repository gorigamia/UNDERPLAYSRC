export function isChristmasSeason(date = new Date()) {
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview-xmas')) return true;
  return date >= new Date(2026, 10, 19) && date < new Date(2027, 0, 1);
}
