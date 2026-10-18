(() => {
  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-links');
  const navLinks = [...menu.querySelectorAll('a[href^="#"]')];

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  function closeMenu() {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  }
  menuButton.addEventListener('click', () => {
    const next = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(next));
    menuButton.setAttribute('aria-label', next ? 'Close navigation' : 'Open navigation');
    menu.classList.toggle('open', next);
    document.body.classList.toggle('menu-open', next);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 620) closeMenu(); });

  document.getElementById('year').textContent = String(new Date().getFullYear());

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .09, rootMargin: '0px 0px -28px 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const memberCount = document.getElementById('member-count');
  const onlineCount = document.getElementById('online-count');
  const updated = document.getElementById('stats-updated');
  const formatter = new Intl.NumberFormat('en-US');
  let statsLoaded = false;
  let statsBusy = false;

  async function loadStats() {
    if (statsBusy || document.hidden) return;
    statsBusy = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      // Netlify's serverless endpoint calls Discord's public invite API,
      // avoiding browser CORS problems and keeping request volume low.
      const response = await fetch('/api/stats', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`Stats request failed: ${response.status}`);
      const data = await response.json();
      if (!Number.isInteger(data.members) || data.members < 0 ||
          !Number.isInteger(data.online) || data.online < 0) {
        throw new Error('Invalid count data');
      }
      memberCount.textContent = formatter.format(data.members);
      onlineCount.textContent = formatter.format(data.online);
      updated.textContent = 'Updated just now';
      statsLoaded = true;
    } catch (error) {
      // Never pretend that a number is live when Discord cannot be reached.
      if (!statsLoaded) { memberCount.textContent = '—'; onlineCount.textContent = '—'; }
      updated.textContent = statsLoaded ? 'Last known counts' : 'Temporarily unavailable';
      console.info('Hubb live stats unavailable:', error.message);
    } finally {
      clearTimeout(timeout);
      statsBusy = false;
    }
  }
  loadStats();
  setInterval(loadStats, 5 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadStats();
  });
})();
