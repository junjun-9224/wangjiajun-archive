/* ============================================================
   个人数据档案 — interactions
   vanilla JS, no dependencies
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  var themeBtn = $('#themeBtn');
  var themeMeta = doc.querySelector('meta[name="theme-color"]');
  var STORE_KEY = 'wjj-site-theme';

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'ink' ? '#0D0C0B' : '#F3EEE5');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'ink' ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', theme === 'ink' ? '切换到浅色主题' : '切换到深色主题');
    }
    if (persist) { try { localStorage.setItem(STORE_KEY, theme); } catch (e) {} }
    if (window.__dotsRecolor) window.__dotsRecolor();
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORE_KEY); } catch (e) {}
  applyTheme(savedTheme === 'ink' ? 'ink' : 'paper', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'ink' ? 'paper' : 'ink', true);
    });
  }

  /* ---------------------------------------------------------
     Nav: stuck state, progress, active link, mobile menu
     --------------------------------------------------------- */
  var nav = $('#nav');
  var progressBar = $('#progressBar');
  var navLinks = $('#navLinks');
  var menuBtn = $('#menuBtn');
  var sectionIds = ['about', 'timeline', 'experience', 'projects', 'skills', 'honors', 'contact'];

  function onScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 12);

    var h = doc.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    if (progressBar) progressBar.style.width = (p * 100).toFixed(2) + '%';

    // active section: the last one whose top passed the 30% viewport line
    var current = '';
    var line = window.innerHeight * 0.32;
    sectionIds.forEach(function (id) {
      var el = doc.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top <= line) current = id;
    });
    $$('.nav-links a[data-nav]').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === current);
    });

    updateRail();
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = doc.body.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });
  }
  $$('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      doc.body.classList.remove('nav-open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', '打开菜单');
      }
    });
  });

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------
     Hero counters
     --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = performance.now();
    var dur = 1400;
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  var statNums = $$('.stat-num');
  if ('IntersectionObserver' in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); statIO.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statIO.observe(el); });
  }

  /* ---------------------------------------------------------
     Timeline: filter, expand, rail fill
     --------------------------------------------------------- */
  var tlItems = $$('.tl-item');
  var tlFill = $('#tlFill');

  function updateRail() {
    if (!tlFill) return;
    var items = $('.tl-items');
    if (!items) return;
    var r = items.getBoundingClientRect();
    var vh = window.innerHeight;
    var startLine = vh * 0.55;
    var p = (startLine - r.top) / Math.max(1, r.height);
    p = Math.min(1, Math.max(0, p));
    tlFill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
  }

  tlItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      // don't hijack text selection
      if (window.getSelection && String(window.getSelection()).length > 0) return;
      item.classList.toggle('is-open');
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('is-open');
      }
    });
  });

  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      $$('.chip').forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      tlItems.forEach(function (item) {
        var show = f === 'all' || item.getAttribute('data-cat') === f;
        item.classList.toggle('is-hidden', !show);
        if (!show) item.classList.remove('is-open');
      });
      window.setTimeout(updateRail, 60);
    });
  });

  /* ---------------------------------------------------------
     Project modal
     --------------------------------------------------------- */
  var modal = $('#modal');
  var modalBody = $('#modalBody');
  var lastFocus = null;

  function openModal(id) {
    var tpl = doc.getElementById('detail-' + id);
    if (!tpl || !modal || !modalBody) return;
    lastFocus = doc.activeElement;
    modalBody.innerHTML = '';
    modalBody.appendChild(tpl.content.cloneNode(true));
    modal.hidden = false;
    doc.body.style.overflow = 'hidden';
    window.requestAnimationFrame(function () { modal.classList.add('is-in'); });
    var closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-in');
    doc.body.style.overflow = '';
    window.setTimeout(function () {
      modal.hidden = true;
      modalBody.innerHTML = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, reduceMotion ? 0 : 300);
  }

  $$('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openModal(btn.getAttribute('data-open'));
    });
  });
  if (modal) {
    $$('[data-close]', modal).forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    doc.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        var focusables = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
          .filter(function (el) { return el.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------------------------------------------------------
     Hero dot field
     --------------------------------------------------------- */
  var canvas = $('#dotCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [];
    var mouse = { x: -9999, y: -9999 };
    var rafId = null;
    var visible = true;
    var colors = { dot: '21,18,15', accent: '200,64,30' };

    function readColors() {
      var cs = getComputedStyle(root);
      var ink = cs.getPropertyValue('--ink').trim();
      var accent = cs.getPropertyValue('--accent').trim();
      function hexToRgb(h) {
        h = h.replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        var n = parseInt(h, 16);
        if (isNaN(n)) return null;
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
      }
      var a = hexToRgb(ink); var b = hexToRgb(accent);
      if (a) colors.dot = a;
      if (b) colors.accent = b;
    }

    function sizeCanvas() {
      var w = canvas.clientWidth || canvas.offsetWidth;
      var h = canvas.clientHeight || canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots(w, h);
    }

    function buildDots(w, h) {
      dots = [];
      var gap = w < 640 ? 30 : w < 1100 ? 34 : 38;
      var cols = Math.ceil(w / gap) + 1;
      var rows = Math.ceil(h / gap) + 1;
      for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          dots.push({
            x: i * gap,
            y: j * gap,
            seed: Math.random() * Math.PI * 2,
            sp: 0.4 + Math.random() * 0.6
          });
        }
      }
    }

    function draw(ts) {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      var t = ts * 0.00035;
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k];
        var dx = d.x - mouse.x;
        var dy = d.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var near = dist < 150 ? (1 - dist / 150) : 0;
        var wave = 0.5 + 0.5 * Math.sin(t * d.sp + d.seed);
        var alpha = 0.1 + wave * 0.07 + near * 0.55;
        var r = 0.9 + near * 1.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + (near > 0.45 ? colors.accent : colors.dot) + ',' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      rafId = visible ? window.requestAnimationFrame(draw) : null;
    }

    readColors();
    sizeCanvas();
    window.__dotsRecolor = readColors;

    if (!reduceMotion) {
      rafId = window.requestAnimationFrame(draw);
    } else {
      // static render once
      draw(0);
      rafId = null;
    }

    var hero = $('.hero');
    if (hero) {
      hero.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      hero.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });
    }

    if ('IntersectionObserver' in window) {
      var heroIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !rafId && !reduceMotion) rafId = window.requestAnimationFrame(draw);
        });
      }, { threshold: 0 });
      if (hero) heroIO.observe(hero);
    }

    var rz;
    window.addEventListener('resize', function () {
      window.clearTimeout(rz);
      rz = window.setTimeout(function () {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeCanvas();
        if (reduceMotion) draw(0);
      }, 180);
    });
  }

  /* ---------------------------------------------------------
     Misc
     --------------------------------------------------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  onScroll();
})();
