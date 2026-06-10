export function initScrollAnimations() {
  // Reveal-on-scroll with a small stagger for siblings revealed together
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        let delay = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
          delay += 90;
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
  }

  // Scroll progress bar + back-to-top visibility
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / max;
    if (progressBar) progressBar.style.width = `${progress * 100}%`;
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Highlight the nav link for the section currently in view
  const navLinks = Array.from(document.querySelectorAll('#primaryNav .nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === id));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
}
