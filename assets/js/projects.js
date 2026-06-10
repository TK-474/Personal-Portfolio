import { openModal } from './modal.js';

export function initProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  async function docExists(path) {
    if (!path) return false;
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function cardHtml(p, index) {
    const tags = (p.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
    const number = String(index + 1).padStart(2, '0');

    let docsButton = '';
    if (await docExists(p.documentation)) {
      docsButton = `<a class="text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1" target="_blank" rel="noreferrer" href="${p.documentation}" onclick="event.stopPropagation()">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Docs
      </a>`;
    }

    return `
      <article class="project-tile reveal" data-project-index="${index}">
        <div class="flex items-center justify-between mb-4">
          <span class="project-index">${number}</span>
          <svg class="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7m0 0H8m9 0v9"/></svg>
        </div>
        ${p.image ? `<img src="${p.image}" alt="${p.title || ''}" class="w-full h-40 object-cover rounded-lg mb-4" />` : ''}
        <h3 class="font-display font-semibold text-lg mb-2 leading-snug">${p.title || 'Untitled'}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed flex-1">${p.description || ''}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">${tags}</div>
        <div class="flex items-center gap-4 text-sm mt-auto">
          ${p.demo ? `<a class="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noreferrer" href="${p.demo}" onclick="event.stopPropagation()">Demo</a>` : ''}
          ${p.source ? `<a class="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noreferrer" href="${p.source}" onclick="event.stopPropagation()">Source</a>` : ''}
          ${docsButton}
        </div>
      </article>`;
  }

  async function render(projects) {
    const cardsHtml = await Promise.all(projects.map(cardHtml));
    projectsGrid.innerHTML = cardsHtml.join('');

    // Cards are injected after the initial reveal pass; animate them in with a stagger.
    projectsGrid.querySelectorAll('.project-tile').forEach((tile, i) => {
      tile.style.setProperty('--reveal-delay', `${i * 80}ms`);
      requestAnimationFrame(() => requestAnimationFrame(() => tile.classList.add('in-view')));
      tile.addEventListener('click', async () => {
        const index = parseInt(tile.getAttribute('data-project-index'));
        await openModal(projects[index]);
      });
    });
  }

  const fallbackProjects = [
    { title: 'Harf ba Harf — Urdu Transcription & Diarization', description: 'Flutter app with FastAPI backend for Urdu ASR (Whisper large-v3-turbo), diarization (pyannote), and summarization (fine-tuned MBart).', tags: ['Flutter', 'FastAPI', 'Whisper', 'pyannote', 'MBart'], demo: '', source: 'https://github.com/saakhani/harf-ba-harf' },
    { title: 'LoRA Fine-Tuning TinyLLaMA (SFT + DPO)', description: 'Evaluated 5 LoRA configs on Dolly-15k; DPO on Argilla UltraFeedback; 14% perplexity reduction with best trial.', tags: ['TinyLLaMA', 'LoRA', 'SFT', 'DPO', 'HuggingFace'], demo: '', source: 'https://huggingface.co/TK47' },
    { title: 'RAG for Design & Analysis of Algorithms', description: 'Hybrid retrieval using FAISS + BM25 with RRF; LLM-generated, context-grounded answers and custom evaluation framework.', tags: ['RAG', 'FAISS', 'BM25', 'RRF', 'LLMs'], demo: '', source: 'https://github.com/TK-474/RAG-for-DAA-Textbook' },
  ];

  fetch('assets/js/projects.json')
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((projects) => render(projects))
    .catch(() => render(fallbackProjects));
}
