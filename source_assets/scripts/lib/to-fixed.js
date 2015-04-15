module.exports = function(x, fixed) {
  if (!x) return x
  fixed = fixed || 2;
  return Number(x).toFixed(fixed) || x;
}
