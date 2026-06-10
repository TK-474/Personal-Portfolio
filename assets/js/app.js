import { initThemeAndHeader } from './theme.js';
import { initScrollAnimations } from './scrollAnimations.js';
import { initProjects } from './projects.js';
import { initProjectModal } from './modal.js';
import { initThreeBackground } from './threebg.js';
import { initContactForm } from './contact.js';
import { initTypewriter } from './typewriter.js';

// Initialize all modules after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  initThemeAndHeader();
  initScrollAnimations();
  initProjectModal();
  initProjects();
  initContactForm();
  initThreeBackground();
  initTypewriter();
});
