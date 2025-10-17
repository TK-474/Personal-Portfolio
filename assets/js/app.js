import { initThemeAndHeader } from './theme.js';
import { initScrollAnimations } from './scrollAnimations.js';
import { initProjects } from './projects.js';
import { initProjectModal } from './modal.js';
import { initThreeBackground } from './threebg.js';
import { initContactForm } from './contact.js';

// Initialize all modules after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const themeToggle = document.getElementById('themeToggle');

  initThemeAndHeader();
  initScrollAnimations();
  initProjectModal();
  initProjects();
  initContactForm();
  initThreeBackground(themeToggle);
});


