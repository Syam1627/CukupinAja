/* ===== CukupinAja – Main Script ===== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Cek ketersediaan Anime.js
  if (!window.anime) {
    console.error("Anime.js gagal dimuat dari CDN!");
    document.documentElement.classList.add('no-anim');
    document.querySelectorAll('.split').forEach(el => el.style.opacity = '1');
    return;
  }

  const { animate, splitText, stagger, utils } = anime;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- Mobile Detection ---------- */
  const isMobile = () => window.innerWidth <= 800;

  /* ---------- Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- 2. Sequence Frame Gambar Canvas ---------- */
  const FRAME_COUNT = 72;
  const framePath = i => `Assets-jpg/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
  
  const canvas = document.getElementById('man-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const frames = [];
  let current = 0;

  if (canvas && ctx) {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (i === 1 || i - 1 === current) draw(current);
      };
      frames.push(img);
    }
  }

  function draw(idx) {
    if (!ctx || !canvas) return;
    for (let k = idx; k >= 0; k--) {
      const img = frames[k];
      if (img && img.complete && img.naturalWidth > 0) {
        const cw = canvas.width, ch = canvas.height;
        const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) * 0.7, ch - h, w, h);
        return;
      }
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    draw(current);
  }

  /* ---------- 3. Helper SplitText & Penanganan Teks ---------- */
  function makeGroup(textSelectors, extraSelector) {
    let words = [];
    textSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.opacity = '1';
      if (typeof splitText === 'function') {
        try {
          const res = splitText(el, { words: { wrap: 'clip' } });
          if (res && res.words) words.push(...res.words);
        } catch (e) {
          console.warn("splitText dilewati untuk:", sel);
        }
      }
    });

    const extras = extraSelector ? [...document.querySelectorAll(extraSelector)] : [];

    if (words.length > 0 && utils) utils.set(words, { opacity: 0, y: '110%' });
    if (extras.length > 0 && utils) utils.set(extras, { opacity: 0, y: 24 });

    return { words, extras, runs: [] };
  }

  function toggle(g, show) {
    if (!g) return;
    g.runs.forEach(a => a && a.pause && a.pause());
    if (reduce) {
      if (g.words.length && utils) utils.set(g.words, { opacity: show ? 1 : 0, y: '0%' });
      if (g.extras.length && utils) utils.set(g.extras, { opacity: show ? 1 : 0, y: 0 });
      return;
    }

    const newRuns = [];
    if (g.words.length > 0) {
      newRuns.push(
        animate(g.words, show
          ? { y: ['110%', '0%'], opacity: [0, 1], duration: 800, delay: stagger(45), ease: 'out(4)' }
          : { y: ['0%', '-110%'], opacity: [1, 0], duration: 450, delay: stagger(18), ease: 'in(3)' })
      );
    }
    if (g.extras.length > 0) {
      newRuns.push(
        animate(g.extras, show
          ? { y: [24, 0], opacity: [0, 1], duration: 700, delay: 450, ease: 'out(3)' }
          : { y: [0, -24], opacity: [1, 0], duration: 350, ease: 'in(3)' })
      );
    }
    g.runs = newRuns;
  }

  /* ---------- 4. Animasi Counter Angka ---------- */
  const n15 = document.getElementById('n15');
  const n30 = document.getElementById('n30');
  const counter = { a: 0, b: 0 };
  let countRun;

  function count(show) {
    if (countRun && countRun.pause) countRun.pause();
    const paint = () => {
      if (n15) n15.textContent = Math.round(counter.a);
      if (n30) n30.textContent = Math.round(counter.b);
    };

    if (reduce) {
      counter.a = show ? 15 : 0;
      counter.b = show ? 30 : 0;
      paint();
      return;
    }

    countRun = animate(counter, {
      a: show ? 15 : 0,
      b: show ? 30 : 0,
      duration: show ? 1800 : 400,
      delay: show ? 400 : 0,
      ease: show ? 'out(3)' : 'in(2)',
      onUpdate: paint
    });
  }

  /* ---------- 5. Event Scroll & Navigasi ---------- */
  const track = document.querySelector('.hero-track');
  const edu = document.getElementById('edukasi');
  const fades = [...document.querySelectorAll('.hero .fade-asset')];
  let heroShown = true;
  let eduShown = false;
  let heroGroup, eduGroup;

  function update() {
    if (!track) return;

    // On mobile, skip scroll-driven canvas animation
    if (isMobile()) {
      // Still handle edu section visibility
      if (edu) {
        const r = edu.getBoundingClientRect();
        const wantEdu = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
        if (wantEdu !== eduShown) {
          eduShown = wantEdu;
          toggle(eduGroup, wantEdu);
          count(wantEdu);
        }
      }
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const maxScroll = track.offsetHeight - window.innerHeight;
    const p = maxScroll > 0 ? clamp(-trackRect.top / maxScroll) : 0;

    const o = 1 - clamp(p / 0.15);
    fades.forEach(el => { el.style.opacity = o; });

    const idx = Math.round(clamp(p / 0.85) * (FRAME_COUNT - 1));
    if (idx !== current) {
      current = idx;
      draw(idx);
    }

    const wantHero = p < 0.2;
    if (wantHero !== heroShown) {
      heroShown = wantHero;
      toggle(heroGroup, wantHero);
    }

    if (edu) {
      const r = edu.getBoundingClientRect();
      const wantEdu = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.25;
      if (wantEdu !== eduShown) {
        eduShown = wantEdu;
        toggle(eduGroup, wantEdu);
        count(wantEdu);
      }
    }
  }

  /* ---------- 6. Inisialisasi ---------- */
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    update();
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }
  }, { passive: true });

  document.fonts.ready.then(() => {
    heroGroup = makeGroup(['#hero-title', '#hero-lead'], '#hero-cta, .credit');
    eduGroup = makeGroup(['#edu-quote']);
    update();
    if (heroGroup) toggle(heroGroup, true);
  });
});