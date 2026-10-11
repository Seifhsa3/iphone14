/* ================= SCROLL REVEAL ================= */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();

/* ================= NAV STATE ================= */
(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var anchors = links ? links.querySelectorAll('a') : [];

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        anchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();

/* ================= COLOR SWITCHER ================= */
(function () {
  var COLORS = [
    { ar: 'أصفر',        en: 'Yellow',        body: ['#ffe47a', '#f0c02f', '#b8891a'], back: ['#fbeaa4', '#eed15c', '#c19a26'], desc: 'ألوان دافئة ومشرقة تُبرز جوانب التصميم المستوية.' },
    { ar: 'أزرق',        en: 'Blue',          body: ['#8ec0f0', '#3a7bc8', '#1d4d85'], back: ['#b8d9f7', '#5c9ad9', '#2f6ba5'], desc: 'أزرق سماوي هادئ بانعكاس معدني لامع.' },
    { ar: 'برقوقي',      en: 'Purple',        body: ['#d9c3e8', '#a988c4', '#6d5188'], back: ['#e6d6f0', '#c3a4d8', '#8f6faa'], desc: 'بنفسجي ملكي بلمسة معدنية راقية.' },
    { ar: 'منتصف الليل', en: 'Midnight',      body: ['#4b525f', '#2b313c', '#14171e'], back: ['#5c636f', '#363c47', '#1a1d24'], desc: 'أسود عميق بلمعان يعكس الضوء بهدوء.' },
    { ar: 'ضوء النجوم',  en: 'Starlight',     body: ['#faf0dc', '#e8d9bd', '#bfa887'], back: ['#fff7e8', '#f2e6cd', '#cdb99a'], desc: 'أبيض عاجي دافئ بلمسة ذهبية خفيفة.' },
    { ar: 'أحمر',        en: '(PRODUCT)RED',  body: ['#ef8a8a', '#c9353c', '#8d1f27'], back: ['#f4a0a0', '#d6454c', '#99252d'], desc: 'أحمر عميق بلمسة لامعة مميزة.' }
  ];

  var wrap = document.getElementById('swatches');
  var svg = document.getElementById('colorPhone');
  var nameEl = document.getElementById('colorName');
  var enEl = document.getElementById('colorEn');
  var descEl = document.getElementById('colorDesc');
  if (!wrap || !svg) return;

  var stops = {
    b0: svg.querySelector('#b0'), b1: svg.querySelector('#b1'), b2: svg.querySelector('#b2'),
    k0: svg.querySelector('#k0'), k1: svg.querySelector('#k1'), k2: svg.querySelector('#k2')
  };

  function apply(i) {
    var c = COLORS[i];
    stops.b0.setAttribute('stop-color', c.body[0]);
    stops.b1.setAttribute('stop-color', c.body[1]);
    stops.b2.setAttribute('stop-color', c.body[2]);
    stops.k0.setAttribute('stop-color', c.back[0]);
    stops.k1.setAttribute('stop-color', c.back[1]);
    stops.k2.setAttribute('stop-color', c.back[2]);

    nameEl.textContent = c.ar;
    enEl.textContent = c.en;
    descEl.textContent = c.desc;
    svg.setAttribute('aria-label', 'نموذج آيفون 14 بلون ' + c.ar);

    svg.classList.remove('swap');
    void svg.offsetWidth;
    svg.classList.add('swap');

    Array.prototype.forEach.call(wrap.children, function (b, bi) {
      b.setAttribute('aria-pressed', String(bi === i));
    });
  }

  COLORS.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.title = c.ar + ' — ' + c.en;
    b.setAttribute('aria-label', 'اللون ' + c.ar);
    b.setAttribute('aria-pressed', String(i === 0));
    b.style.background = 'linear-gradient(140deg,' + c.body[0] + ',' + c.body[1] + ' 55%,' + c.body[2] + ')';
    b.addEventListener('click', function () { apply(i); });
    wrap.appendChild(b);
  });

  apply(0);
})();

/* ================= SMOOTH ANCHOR FALLBACK ================= */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.replaceState) history.replaceState(null, '', id);
  });
})();