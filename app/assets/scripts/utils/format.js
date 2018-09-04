export function formatPercent (n, upperLimit) {
  if ((n !== 0 && !n) || isNaN(n)) {
    return '-';
  }
  let pct = Math.round(parseFloat(n) * 100);
  if (typeof upperLimit !== 'undefined' && !isNaN(upperLimit) && pct > upperLimit) {
    pct = upperLimit;
  }
  return pct + '%';
}

export function formatTableText (text) {
  if (text === null) { return text; }

  // Allow line breaks at '/' characters
  text = text.replace(/\//g, '/\u200b');

  return text;
}

export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
