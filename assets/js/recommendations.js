(function () {
  'use strict';

  var toggle = document.getElementById('rec-toggle');
  var expanded = document.getElementById('rec-expanded');
  var previewGrid = document.getElementById('rec-preview-grid');

  if (!toggle || !expanded) return;

  toggle.addEventListener('click', function () {
    var isOpen = expanded.classList.toggle('is-open');
    if (previewGrid) previewGrid.classList.toggle('is-open', isOpen);
    expanded.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    var btnText = toggle.querySelector('.btn-text');
    var btnArrow = toggle.querySelector('.btn-arrow');
    if (btnText && btnArrow) {
      btnText.textContent = isOpen ? 'Show Fewer Recommendations' : 'Read More Recommendations';
      btnArrow.textContent = isOpen ? '▴' : '▾';
    } else {
      toggle.textContent = isOpen ? 'Show Fewer Recommendations' : 'Read More Recommendations';
    }

    if (isOpen) {
      window.requestAnimationFrame(function () {
        toggle.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  });
})();
