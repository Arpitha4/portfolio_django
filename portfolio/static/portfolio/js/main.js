/* =====================================================================
   main.js – navigation, scroll-spy, reveal, typing, swiper, particles
   and the theme switcher (presets + custom header/body/accent colours)
   ===================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'pf-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------------
     Colour helpers
     --------------------------------------------------------------- */
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      v = Math.max(0, Math.min(255, Math.round(v)));
      return (v < 16 ? '0' : '') + v.toString(16);
    }).join('');
  }
  function luminance(hex) {
    var c = hexToRgb(hex);
    return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  }
  function shade(hex, amt) {            // amt > 0 lightens, < 0 darkens
    var c = hexToRgb(hex);
    var t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    return rgbToHex(c.r + (t - c.r) * p, c.g + (t - c.g) * p, c.b + (t - c.b) * p);
  }
  function mix(h1, h2, w) {
    var a = hexToRgb(h1), b = hexToRgb(h2);
    return rgbToHex(a.r + (b.r - a.r) * w, a.g + (b.g - a.g) * w, a.b + (b.b - a.b) * w);
  }

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  var navToggle = $('#navToggle');
  var primaryNav = $('#primaryNav');
  var header = $('#siteHeader');

  function closeNav() {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    var icon = $('i', navToggle);
    if (icon) icon.className = 'fa-solid fa-bars';
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      var icon = $('i', navToggle);
      if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // close after choosing a section
    $all('.nav-link', primaryNav).forEach(function (a) {
      a.addEventListener('click', closeNav);
    });

    // close when tapping outside the drawer
    document.addEventListener('click', function (e) {
      if (primaryNav.classList.contains('open') &&
          !primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });
  }

  /* ---------------------------------------------------------------
     Header shadow, back-to-top, scroll-spy
     --------------------------------------------------------------- */
  var toTop = $('#toTop');
  var sections = $all('main section[id]');
  var navLinks = $all('.nav-link');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 500);

    // highlight the section currently under the header
    var line = y + 140, current = sections.length ? sections[0].id : '';
    sections.forEach(function (s) { if (s.offsetTop <= line) current = s.id; });
    // at the very bottom, make sure the last section is active
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------- */
  var reveals = $all('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------------------------------------------------------
     Typing effect
     --------------------------------------------------------------- */
  var typedEl = $('#typed');
  if (typedEl) {
    var words = ['scalable REST APIs', 'Flask & FastAPI services', 'clean backend systems', 'Django side projects'];
    var wi = 0, ci = 0, deleting = false;
    if (reduceMotion) {
      typedEl.textContent = words[0];
    } else {
      (function tick() {
        var w = words[wi];
        typedEl.textContent = w.substring(0, ci);
        var delay = deleting ? 40 : 85;
        if (!deleting && ci === w.length) { deleting = true; delay = 1500; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
        ci += deleting ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------------------------------------------------------------
     Projects slider (Swiper)
     --------------------------------------------------------------- */
  if (window.Swiper && $('.my-projects-swiper')) {
    new Swiper('.my-projects-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      centeredSlides: false,
      grabCursor: true,
      keyboard: { enabled: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      autoplay: reduceMotion ? false : { delay: 4500, disableOnInteraction: true, pauseOnMouseEnter: true }
    });
  }

  /* ---------------------------------------------------------------
     Particle background (colour follows the active theme)
     --------------------------------------------------------------- */
  var canvas = $('#bg-canvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var W, H, dots = [], dpr = Math.min(window.devicePixelRatio || 1, 2);

    function particleRGB() {
      var v = getComputedStyle(root).getPropertyValue('--particle').trim();
      return v || '124, 92, 255';
    }
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(70, Math.floor(W * H / 22000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.7
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var rgb = particleRGB();
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ', 0.7)';
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j], dx = d.x - e.x, dy = d.y - e.y, dist = dx * dx + dy * dy;
          if (dist < 18000) {
            ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.18 * (1 - dist / 18000)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    resize();
    frame();
  }

  /* ---------------------------------------------------------------
     THEME SWITCHER
     - presets: set data-theme only
     - custom : header / body / accent pickers -> inline CSS variables
     - saved in localStorage ('pf-theme') and restored in base.html <head>
     --------------------------------------------------------------- */
  var themeMenu = $('#themeMenu');
  var themeToggle = $('#themeToggle');
  var themePanel = $('#themePanel');
  var swatches = $all('.swatch');
  var pickHeader = $('#pickHeader');
  var pickBody = $('#pickBody');
  var pickAccent = $('#pickAccent');
  var resetBtn = $('#resetTheme');

  var CUSTOM_VARS = ['--header-bg', '--body-bg', '--body-bg-2', '--accent', '--accent-2',
                     '--on-accent', '--header-text', '--link-bg', '--link', '--particle'];

  function clearCustomVars() {
    CUSTOM_VARS.forEach(function (v) { root.style.removeProperty(v); });
    root.removeAttribute('data-tone');
  }

  function persist(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function syncPickersFromComputed() {
    var cs = getComputedStyle(root);
    function hex(name, fallback) {
      var v = cs.getPropertyValue(name).trim();
      return /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;
    }
    if (pickHeader) pickHeader.value = hex('--header-bg', '#070b18');
    if (pickBody) pickBody.value = hex('--body-bg', '#0b1020');
    if (pickAccent) pickAccent.value = hex('--accent', '#7c5cff');
  }

  function markActiveSwatch(name) {
    swatches.forEach(function (s) {
      s.setAttribute('aria-pressed', String(s.getAttribute('data-preset') === name));
    });
  }

  function applyPreset(name) {
    clearCustomVars();
    root.setAttribute('data-theme', name);
    markActiveSwatch(name);
    persist({ name: name });
    syncPickersFromComputed();
  }

  function applyCustom() {
    var headerC = pickHeader.value, bodyC = pickBody.value, accentC = pickAccent.value;
    var bodyLight = luminance(bodyC) > 0.55;
    var headerLight = luminance(headerC) > 0.55;
    var accent2 = shade(accentC, 0.35);
    var rgb = hexToRgb(accentC);

    var vars = {
      '--header-bg': headerC,
      '--body-bg': bodyC,
      '--body-bg-2': bodyLight ? shade(bodyC, -0.07) : shade(bodyC, 0.08),
      '--accent': accentC,
      '--accent-2': accent2,
      '--on-accent': luminance(accentC) > 0.6 ? '#0b1020' : '#ffffff',
      '--header-text': headerLight ? '#0f172a' : '#ffffff',
      '--link-bg': 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.14)',
      '--link': bodyLight ? shade(accentC, -0.25) : shade(accentC, 0.45),
      '--particle': rgb.r + ', ' + rgb.g + ', ' + rgb.b
    };

    root.setAttribute('data-theme', 'custom');
    root.setAttribute('data-tone', bodyLight ? 'light' : 'dark');
    Object.keys(vars).forEach(function (k) { root.style.setProperty(k, vars[k]); });

    markActiveSwatch('');
    persist({ name: 'custom', vars: vars, tone: bodyLight ? 'light' : 'dark' });
  }

  // preset buttons
  swatches.forEach(function (s) {
    s.addEventListener('click', function () { applyPreset(s.getAttribute('data-preset')); });
  });

  // custom pickers (live update while dragging)
  [pickHeader, pickBody, pickAccent].forEach(function (p) {
    if (p) p.addEventListener('input', applyCustom);
  });

  if (resetBtn) resetBtn.addEventListener('click', function () {
    applyPreset('midnight');
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  });

  // open / close the panel
  function setPanel(open) {
    themePanel.classList.toggle('open', open);
    themeToggle.setAttribute('aria-expanded', String(open));
  }
  if (themeToggle && themePanel) {
    themeToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setPanel(!themePanel.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!themeMenu.contains(e.target)) setPanel(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPanel(false); closeNav(); }
    });
  }

  // initial state (the <head> script already applied the saved theme before paint)
  (function init() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    if (saved && saved.name === 'custom' && saved.vars) {
      root.setAttribute('data-tone', saved.tone || 'dark');   // data-tone isn't set by the head script
      markActiveSwatch('');
    } else {
      markActiveSwatch((saved && saved.name) || root.getAttribute('data-theme') || 'midnight');
    }
    syncPickersFromComputed();
  })();
})();
