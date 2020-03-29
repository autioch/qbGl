export default function keyboard({ selector, onKeydown }) {
  const currentKeys = {};

  function keydown(ev) {
    currentKeys[ev.keyCode] = true;
    onKeydown && onKeydown(ev);
    ev.preventDefault();
  }

  function keyup(ev) {
    currentKeys[ev.keyCode] = false;
    ev.preventDefault();
  }

  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;

  el.addEventListener('focus', () => {
    el.addEventListener('keydown', keydown);
    el.addEventListener('keyup', keyup);
  });

  el.addEventListener('blur', () => {
    el.removeEventListener('keydown', keydown);
    el.removeEventListener('keyup', keyup);
    Object.keys(currentKeys).forEach((key) => currentKeys[key] = false);
  });

  return currentKeys;
}
