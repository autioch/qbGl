export default function mouse({ selector, onStart, onMove, onStop }) {
  function stopMouse() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', stopMouse);
    onStop && onStop();
  }

  function startMouse() {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stopMouse);
    onStart && onStart();
  }

  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;

  el.addEventListener('focus', () => el.addEventListener('mousedown', startMouse));
  el.addEventListener('blur', () => el.removeEventListener('mousedown', startMouse));
}
