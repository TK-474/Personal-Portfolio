let modalElements;

export function initProjectModal() {
  modalElements = {
    container: document.getElementById('projectModal'),
    title: document.getElementById('modalTitle'),
    content: document.getElementById('modalContent'),
    actions: document.getElementById('modalActions'),
    closeBtn: document.getElementById('modalClose'),
    backdrop: document.getElementById('modalBackdrop'),
  };
  modalElements.panel = modalElements.container?.querySelector('.rounded-2xl');

  if (modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', closeModal);
  if (modalElements.backdrop) modalElements.backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElements.container && !modalElements.container.classList.contains('hidden')) {
      closeModal();
    }
  });
}

export async function openModal(project) {
  if (!modalElements || !modalElements.container) return;
  modalElements.title.textContent = project.title || 'Untitled Project';
  const tags = (project.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
  modalElements.content.innerHTML = `
    <div class="space-y-4">
      <p class="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">${project.description || ''}</p>
      <div class="flex flex-wrap gap-1.5">${tags}</div>
      ${project.details ? `<p class="text-slate-700 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-200 dark:border-white/10 pt-4">${project.details}</p>` : ''}
    </div>`;

  let actionsHtml = '';
  if (project.demo) actionsHtml += `<a href="${project.demo}" target="_blank" rel="noreferrer" class="btn-primary text-sm">View Demo</a>`;
  if (project.source) actionsHtml += `<a href="${project.source}" target="_blank" rel="noreferrer" class="btn-ghost text-sm">View Source</a>`;

  if (project.documentation) {
    try {
      const response = await fetch(project.documentation, { method: 'HEAD' });
      if (response.ok) {
        actionsHtml += `<a href="${project.documentation}" target="_blank" rel="noreferrer" class="btn-ghost text-sm text-cyan-600 dark:text-cyan-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Documentation
        </a>`;
      }
    } catch (error) {
      // Documentation file doesn't exist; skip the button.
    }
  }

  modalElements.actions.innerHTML = actionsHtml;

  modalElements.container.classList.remove('hidden');
  if (modalElements.panel) {
    modalElements.panel.classList.remove('modal-enter');
    void modalElements.panel.offsetWidth; // restart animation
    modalElements.panel.classList.add('modal-enter');
  }
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  if (!modalElements || !modalElements.container) return;
  modalElements.container.classList.add('hidden');
  document.body.style.overflow = '';
}
