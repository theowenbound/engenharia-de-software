/* ==========================================================================
   ENGENHARIA DE SOFTWARE — main.js
   Comportamentos comuns a todas as páginas: animações de entrada
   (inclusive dos gráficos) e botão "voltar ao topo".
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-chart]'));
    if (!items.length) { return; }
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function initBackToTop() {
    var button = document.querySelector('.to-top');
    if (!button) { return; }
    var ticking = false;
    function update() {
      ticking = false;
      // Só aparece em páginas longas, depois de rolar bastante
      var long = document.documentElement.scrollHeight > window.innerHeight * 2;
      button.hidden = !(long && window.scrollY > window.innerHeight * 0.9);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      var main = document.getElementById('conteudo');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    });
    update();
  }

  function init() {
    initReveal();
    initBackToTop();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
