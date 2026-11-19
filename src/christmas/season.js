export function isChristmasSeason(date = new Date()) {
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('preview-xmas')) return true;
  const month = date.getMonth();
  return month === 11;
}
