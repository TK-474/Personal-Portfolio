import { openModal } from './modal.js';

export function initProjects() {
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  function cardHtml(p, index) {
    const tags = (p.tags || []).map((t) => `<span class="tag">${t}</span>`).join(' ');
    return `
      <article class="project-tile p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer" data-project-index="${index}">
        ${p.image ? `<img src="${p.image}" alt="${p.title || ''}" class="w-full h-40 object-cover rounded-lg mb-4" />` : ''}
        <h3 class="font-semibold text-lg mb-1">${p.title || 'Untitled'}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">${p.description || ''}</p>
        <div class="flex flex-wrap gap-2 mb-3">${tags}</div>
        <div class="flex items-center gap-3 text-sm">
          ${p.demo ? `<a class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer" href="${p.demo}" onclick="event.stopPropagation()">Demo</a>` : ''}
          ${p.source ? `<a class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer" href="${p.source}" onclick="event.stopPropagation()">Source</a>` : ''}
        </div>
      </article>`;
  }

  function render(projects) {
    projectsGrid.innerHTML = projects.map(cardHtml).join('');
    // Attach click handlers
    projectsGrid.querySelectorAll('.project-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const index = parseInt(tile.getAttribute('data-project-index'));
        openModal(projects[index]);
      });
    });
  }

  const fallbackProjects = [
    { title: 'Harf ba Harf — Urdu Transcription & Diarization', description: 'Flutter app with FastAPI backend for Urdu ASR (Whisper large-v3-turbo), diarization (pyannote), and summarization (fine-tuned MBart).', tags: ['Flutter','FastAPI','Whisper','pyannote','MBart'], demo: '', source: 'https://github.com/saakhani/harf-ba-harf' },
    { title: 'LoRA Fine-Tuning TinyLLaMA (SFT + DPO)', description: 'Evaluated 5 LoRA configs on Dolly-15k; DPO on Argilla UltraFeedback; 14% perplexity reduction with best trial.', tags: ['TinyLLaMA','LoRA','SFT','DPO','HuggingFace'], demo: '', source: 'https://huggingface.co/TK47' },
    { title: 'RAG for Design & Analysis of Algorithms', description: 'Hybrid retrieval using FAISS + BM25 with RRF; LLM-generated, context-grounded answers and custom evaluation framework.', tags: ['RAG','FAISS','BM25','RRR','LLMs'], demo: '', source: 'https://github.com/TK-474/RAG-for-DAA-Textbook' },
  ];

  fetch('assets/js/projects.json')
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((projects) => render(projects))
    .catch(() => render(fallbackProjects));
}


