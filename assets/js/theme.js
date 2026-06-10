export function initThemeAndHeader() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close mobile menu when a link is tapped
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  const themeToggle = document.getElementById('themeToggle');

  function setTheme(mode) {
    const dark = mode === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', mode);
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }
}
