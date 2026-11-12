/* ==========================================================================
   ENGENHARIA DE SOFTWARE — interactions.js
   Interações específicas de algumas páginas. Cada função verifica se os
   elementos existem, então o mesmo arquivo pode ser carregado em todas.

   1. História: linha do tempo (progresso, marco ativo, "Por que importa")
   2. Áreas: filtro por foco
   3. Como se constrói: etapas (abas acessíveis)
   4. Como se constrói: aplicativo de exemplo, testes e esteira de publicação
   5. Stand: janela de ampliação das fotos (lightbox)
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- 1. LINHA DO TEMPO ---------- */
  function initTimeline() {
    var timeline = $('[data-timeline]');
    if (!timeline) { return; }

    // Botões "Por que importa"
    $$('.milestone__more', timeline).forEach(function (button) {
      var extra = document.getElementById(button.getAttribute('aria-controls'));
      if (!extra) { return; }
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        extra.hidden = !open;
      });
    });

    // Progresso da linha e marco ativo conforme a rolagem
    var milestones = $$('.milestone', timeline);
    var links = $$('.timeline-index__list a');
    var ticking = false;

    function update() {
      ticking = false;
      var rect = timeline.getBoundingClientRect();
      var line = window.innerHeight * 0.4;
      var progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
      timeline.style.setProperty('--p', progress.toFixed(4));

      var activeIndex = 0;
      milestones.forEach(function (m, i) { if (m.getBoundingClientRect().top <= line) { activeIndex = i; } });
      milestones.forEach(function (m, i) { m.classList.toggle('is-active', i === activeIndex); });
      links.forEach(function (a, i) {
        var active = i === activeIndex;
        a.classList.toggle('is-active', active);
        if (active) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 2. FILTRO DE ÁREAS ---------- */
  function initAreaFilter() {
    var filter = $('[data-filter]');
    var list = $('[data-filter-list]');
    if (!filter || !list) { return; }

    var buttons = $$('[data-filter-value]', filter);
    var items = $$('[data-group]', list);
    var status = $('[data-filter-status]', filter);

    function apply(value) {
      var shown = 0;
      items.forEach(function (item) {
        var visible = value === 'todas' || item.getAttribute('data-group') === value;
        item.hidden = !visible;
        if (visible) { shown++; }
      });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter-value') === value)); });
      if (status) { status.textContent = 'Mostrando ' + shown + (shown === 1 ? ' área.' : ' áreas.'); }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () { apply(button.getAttribute('data-filter-value')); });
    });

    // Se alguém chegar por um link direto (ex.: areas.html#ia), garante que a área esteja visível
    window.addEventListener('hashchange', function () { apply('todas'); });
  }

  /* ---------- 3. ETAPAS DO CICLO DE VIDA ---------- */
  function initLifecycle() {
    var root = $('[data-lifecycle]');
    if (!root) { return; }

    var tabs = $$('[role="tab"]', root);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var prev = $('[data-lc-prev]', root);
    var next = $('[data-lc-next]', root);
    var counter = $('[data-lc-current]', root);
    var index = 0;

    function select(i, focus) {
      index = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach(function (tab, n) {
        var active = n === index;
        tab.setAttribute('aria-selected', String(active));
        tab.setAttribute('tabindex', active ? '0' : '-1');
        tab.classList.toggle('is-done', n < index);
        panels[n].hidden = !active;
      });
      if (counter) { counter.textContent = String(index + 1); }
      if (prev) { prev.disabled = index === 0; }
      if (next) { next.disabled = index === tabs.length - 1; }
      if (focus) { tabs[index].focus(); }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (event) {
        var keys = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: tabs.length - 1 };
        if (Object.prototype.hasOwnProperty.call(keys, event.key)) { event.preventDefault(); select(keys[event.key], true); }
      });
    });
    if (prev) { prev.addEventListener('click', function () { select(index - 1); }); }
    if (next) { next.addEventListener('click', function () { select(index + 1); }); }

    select(0);
  }

  /* ---------- 4. APLICATIVO DE EXEMPLO "MONITORIA FÁCIL" (fictício) ---------- */
  var DIAS_UTEIS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
  var codigoComErro = false; // ligado pela caixa "Simular um erro no código"

  // Regra de agendamento (RF2 e RF3). É a mesma função mostrada na etapa 5.
  function validarAgendamento(agenda, pedido) {
    if (!pedido.disciplina) { return { ok: false, mensagem: 'Escolha a disciplina.' }; }
    if (DIAS_UTEIS.indexOf(pedido.dia) === -1) { return { ok: false, mensagem: 'Os atendimentos acontecem só de segunda a sexta.' }; }
    var ultimoInicio = codigoComErro ? 17 : 16; // o "erro" simulado aceita 17h
    if (pedido.hora < 13 || pedido.hora > ultimoInicio) { return { ok: false, mensagem: 'O início deve ser entre 13h e 16h (o último atendimento termina às 17h).' }; }
    var ocupado = agenda.some(function (r) { return r.disciplina === pedido.disciplina && r.dia === pedido.dia && r.hora === pedido.hora; });
    if (ocupado) { return { ok: false, mensagem: 'Esse horário já está reservado para ' + pedido.disciplina + '.' }; }
    return { ok: true, mensagem: 'Reserva confirmada: ' + pedido.disciplina + ', ' + pedido.dia + ', às ' + pedido.hora + 'h.' };
  }

  var TESTES = [
    { id: '1', rodar: function () { return validarAgendamento([], { disciplina: 'Matemática', dia: 'terça', hora: 14 }).ok === true; } },
    { id: '2', rodar: function () { return validarAgendamento([{ disciplina: 'Matemática', dia: 'terça', hora: 14 }], { disciplina: 'Matemática', dia: 'terça', hora: 14 }).ok === false; } },
    { id: '3', rodar: function () { return validarAgendamento([{ disciplina: 'Matemática', dia: 'terça', hora: 14 }], { disciplina: 'Física', dia: 'terça', hora: 14 }).ok === true; } },
    { id: '4', rodar: function () { return validarAgendamento([], { disciplina: 'Matemática', dia: 'sábado', hora: 14 }).ok === false; } },
    { id: '5', rodar: function () { return validarAgendamento([], { disciplina: 'Matemática', dia: 'terça', hora: 17 }).ok === false; } },
    { id: '6', rodar: function () { return validarAgendamento([], { disciplina: '', dia: 'terça', hora: 14 }).ok === false; } }
  ];

  function initDemo() {
    var form = $('[data-demo-form]');
    var testButton = $('[data-test-run]');
    if (!form && !testButton) { return; }

    /* Agenda simulada (fica só na memória da página) */
    var reservaExemplo = { disciplina: 'Matemática', dia: 'terça', hora: 14, exemplo: true };
    var agenda = [reservaExemplo];
    var result = $('[data-demo-result]');
    var agendaList = $('[data-demo-agenda]');

    function renderAgenda() {
      if (!agendaList) { return; }
      agendaList.innerHTML = '';
      agenda.forEach(function (r) {
        var li = document.createElement('li');
        li.textContent = r.disciplina + ' · ' + r.dia + ' · ' + r.hora + 'h ';
        if (r.exemplo) { var s = document.createElement('small'); s.textContent = '(reserva de exemplo)'; li.appendChild(s); }
        agendaList.appendChild(li);
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var pedido = {
          disciplina: form.elements.disciplina.value,
          dia: form.elements.dia.value,
          hora: parseInt(form.elements.hora.value, 10)
        };
        var r = validarAgendamento(agenda, pedido);
        if (r.ok) { agenda.push(pedido); renderAgenda(); }
        result.textContent = r.mensagem;
        result.classList.toggle('is-ok', r.ok);
        result.classList.toggle('is-error', !r.ok);
      });
      var reset = $('[data-demo-reset]');
      if (reset) {
        reset.addEventListener('click', function () {
          agenda = [reservaExemplo];
          renderAgenda();
          result.textContent = 'Agenda restaurada. Matemática na terça às 14h continua ocupada (reserva de exemplo).';
          result.classList.remove('is-ok', 'is-error');
        });
      }
      renderAgenda();
    }

    /* Testes automatizados e esteira de publicação */
    var summary = $('[data-test-summary]');
    var bugToggle = $('[data-test-bug]');
    var pipeline = $('[data-pipeline]');
    var pipelineStatus = $('[data-pipeline-status]');

    function setPipeline(state, failures) {
      if (!pipeline) { return; }
      var tests = $('[data-pipeline-tests]', pipeline);
      var review = $('[data-pipeline-review]', pipeline);
      var deploy = $('[data-pipeline-deploy]', pipeline);
      [tests, review, deploy].forEach(function (s) { s.classList.remove('is-done', 'is-blocked'); });
      pipelineStatus.classList.remove('is-ok', 'is-error');
      if (state === 'ok') {
        tests.classList.add('is-done'); review.classList.add('is-done'); deploy.classList.add('is-done');
        pipelineStatus.textContent = 'Todas as verificações passaram: a nova versão foi publicada (simulação).';
        pipelineStatus.classList.add('is-ok');
      } else if (state === 'fail') {
        tests.classList.add('is-blocked');
        pipelineStatus.textContent = 'Publicação bloqueada: ' + failures + (failures === 1 ? ' teste falhou.' : ' testes falharam.') + ' Corrija o código e execute os testes de novo.';
        pipelineStatus.classList.add('is-error');
      } else {
        pipelineStatus.textContent = state === 'changed'
          ? 'O código mudou: execute os testes novamente na etapa 6.'
          : 'Aguardando: execute os testes na etapa 6.';
      }
    }

    if (testButton) {
      testButton.addEventListener('click', function () {
        var falhas = 0;
        TESTES.forEach(function (t) {
          var item = $('[data-test="' + t.id + '"]');
          var passou = false;
          try { passou = t.rodar(); } catch (e) { passou = false; }
          if (!passou) { falhas++; }
          if (item) {
            item.classList.toggle('is-pass', passou);
            item.classList.toggle('is-fail', !passou);
          }
        });
        summary.classList.toggle('is-ok', falhas === 0);
        summary.classList.toggle('is-error', falhas > 0);
        summary.textContent = falhas === 0
          ? 'Todos os 6 testes passaram.'
          : (TESTES.length - falhas) + ' de 6 testes passaram. ' + (falhas === 1 ? 'Um teste encontrou um erro.' : falhas + ' testes encontraram erros.');
        setPipeline(falhas === 0 ? 'ok' : 'fail', falhas);
      });
    }

    if (bugToggle) {
      bugToggle.addEventListener('change', function () {
        codigoComErro = bugToggle.checked;
        $$('[data-test]').forEach(function (li) { li.classList.remove('is-pass', 'is-fail'); });
        summary.classList.remove('is-ok', 'is-error');
        summary.textContent = codigoComErro
          ? 'O código foi alterado com um erro. Execute os testes para ver o que acontece.'
          : 'O erro foi corrigido. Execute os testes novamente.';
        setPipeline('changed');
      });
    }
  }

  /* ---------- 5. LIGHTBOX DA GALERIA ---------- */
  function initLightbox() {
    var dialog = $('#lightbox');
    if (!dialog) { return; }
    var img = $('.lightbox__img', dialog);
    var caption = $('.lightbox__caption', dialog);
    var close = $('.lightbox__close', dialog);
    var trigger = null;

    document.addEventListener('click', function (event) {
      var opener = event.target.closest ? event.target.closest('[data-lightbox-open]') : null;
      if (!opener) { return; }
      var source = $('img', opener);
      if (!source) { return; }
      var fig = opener.closest('figure');
      var cap = fig ? $('figcaption', fig) : null;
      trigger = opener;
      img.src = source.currentSrc || source.src;
      img.alt = source.alt || '';
      caption.textContent = cap ? cap.textContent.replace(/\s+/g, ' ').trim() : source.alt;
      if (typeof dialog.showModal === 'function') { dialog.showModal(); } else { dialog.setAttribute('open', ''); }
      close.focus();
    });

    function shut() { if (typeof dialog.close === 'function') { dialog.close(); } else { dialog.removeAttribute('open'); } }
    close.addEventListener('click', shut);
    dialog.addEventListener('click', function (event) { if (event.target === dialog) { shut(); } });
    dialog.addEventListener('close', function () { img.removeAttribute('src'); if (trigger) { trigger.focus(); } });
  }

  function init() {
    initTimeline();
    initAreaFilter();
    initLifecycle();
    initDemo();
    initLightbox();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
