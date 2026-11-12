/* ==========================================================================
   ENGENHARIA DE SOFTWARE — navigation.js
   Menu móvel e estado do cabeçalho. A página ativa já vem marcada no HTML
   com aria-current="page", então funciona mesmo sem JavaScript.
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!header || !toggle || !nav) { return; }
    var label = toggle.querySelector('.nav-toggle__text');
    var wide = window.matchMedia('(min-width: 1101px)');

    function setOpen(open, focusToggle) {
      header.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) { label.textContent = open ? 'Fechar' : 'Menu'; }
      if (!open && focusToggle) { toggle.focus(); }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false, true); }
    });

    var reset = function () { if (wide.matches) { setOpen(false); } };
    if (wide.addEventListener) { wide.addEventListener('change', reset); } else if (wide.addListener) { wide.addListener(reset); }

    // Linha fina sob o cabeçalho depois que a página rola
    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
