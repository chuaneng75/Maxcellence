document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---- hero slideshow: crossfade every 4s, with dot nav + play/pause ----
  const hero = document.getElementById('hero');
  if (hero) {
    const slides = hero.querySelectorAll('.hero-slide');
    const captions = hero.querySelectorAll('.caption-item');
    const dots = hero.querySelectorAll('.hero-dots button');
    const toggleBtn = document.getElementById('heroToggle');
    const iconPlay = toggleBtn ? toggleBtn.querySelector('.icon-play') : null;
    const iconPause = toggleBtn ? toggleBtn.querySelector('.icon-pause') : null;

    let index = 0;
    let playing = true;
    let timer = null;
    const INTERVAL = 4000;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === index));
      captions.forEach((c, n) => c.classList.toggle('active', n === index));
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
    }

    function tick() { show(index + 1); }
    function startPlay() { stopPlay(); timer = setInterval(tick, INTERVAL); }
    function stopPlay() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach((dot, n) => {
      dot.addEventListener('click', () => {
        show(n);
        if (playing) startPlay();
      });
    });

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        playing = !playing;
        toggleBtn.setAttribute('aria-pressed', String(!playing));
        toggleBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
        if (iconPlay) iconPlay.style.display = playing ? 'none' : 'block';
        if (iconPause) iconPause.style.display = playing ? 'block' : 'none';
        if (playing) startPlay(); else stopPlay();
      });
    }

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      playing = false;
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-pressed', 'true');
        toggleBtn.setAttribute('aria-label', 'Play slideshow');
      }
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    } else {
      startPlay();
    }
  }
});
