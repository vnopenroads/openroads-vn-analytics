export function formatPercent (n) {
  if (n !== 0 && !n) {
    return '--';
  }
  return Math.round(parseFloat(n) * 100) + '%';
}
