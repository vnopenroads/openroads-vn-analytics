import d3 from 'd3';

export function formatPercent (n) {
  if (n !== 0 && !n || isNaN(n)) {
    return '-';
  }
  return Math.round(parseFloat(n) * 100) + '%';
}

export function formatThousands (number, decimals = 2) {
  if (isNaN(number)) {
    return '-';
  }
  let n = d3.format(',.' + decimals + 'f')(number);
  return n.replace(new RegExp('\\.0{' + decimals + '}$'), '');
}

export function formatCurrency (number, decimals = 2) {
  if (number >= 1e9) {
    return d3.format(',.' + decimals + 'f')(number / 1e9) + ' B';
  }
  if (number >= 1e6) {
    return d3.format(',.' + decimals + 'f')(number / 1e6) + ' M';
  }
  return d3.format(',.' + decimals + 'f')(number);
}
