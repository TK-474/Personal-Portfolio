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

  if (modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', closeModal);
  if (modalElements.backdrop) modalElements.backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElements.container && !modalElements.container.classList.contains('hidden')) {
      closeModal();
    }
  });
}

export function openModal(project) {
  if (!modalElements || !modalElements.container) return;
  modalElements.title.textContent = project.title || 'Untitled Project';
  const tags = (project.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
  modalElements.content.innerHTML = `
    <div class="space-y-4">
      <p class="text-slate-600 dark:text-slate-300 text-lg">${project.description || ''}</p>
      <div class="flex flex-wrap gap-2">${tags}</div>
      ${project.details ? `<div class="prose dark:prose-invert max-w-none"><p class="text-slate-700 dark:text-slate-300">${project.details}</p></div>` : ''}
    </div>`;

  let actionsHtml = '';
  if (project.demo) actionsHtml += `<a href="${project.demo}" target="_blank" rel="noreferrer" class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">View Demo</a>`;
  if (project.source) actionsHtml += `<a href="${project.source}" target="_blank" rel="noreferrer" class="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">View Source</a>`;
  modalElements.actions.innerHTML = actionsHtml;

  modalElements.container.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  if (!modalElements || !modalElements.container) return;
  modalElements.container.classList.add('hidden');
  document.body.style.overflow = '';
}


