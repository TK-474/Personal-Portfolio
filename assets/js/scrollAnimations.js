export function initScrollAnimations() {
  const observersSupported = 'IntersectionObserver' in window;
  if (!observersSupported) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => io.observe(el));
}


