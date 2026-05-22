(function () {
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('nav-drawer');
  var close = document.querySelector('.nav-drawer-close');
  var previousFocus = null;
  var focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  if (!toggle || !drawer) return;

  function isOpen() {
    return drawer.classList.contains('open');
  }

  function focusableItems() {
    return Array.prototype.slice.call(drawer.querySelectorAll(focusableSelector));
  }

  function open() {
    if (isOpen()) return;
    previousFocus = document.activeElement;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');

    var first = close || focusableItems()[0];
    if (first) first.focus();
  }

  function shut() {
    if (!isOpen()) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');

    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) shut();
    else open();
  });
  if (close) close.addEventListener('click', shut);
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', shut);
  });
  document.addEventListener('keydown', function (event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      shut();
      return;
    }
    if (event.key !== 'Tab') return;

    var items = focusableItems();
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
