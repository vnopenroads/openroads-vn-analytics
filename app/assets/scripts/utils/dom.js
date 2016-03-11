export function parentHasClass (element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}

export function isDescendent (element, parent) {
  do {
    if (element === parent) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}
