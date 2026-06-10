export function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'AI Engineer',
    'ML & NLP Enthusiast',
    'LLM Fine-Tuner',
    'Full-Stack Developer',
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  const TYPE_MS = 70;
  const DELETE_MS = 40;
  const HOLD_MS = 2000;
  const GAP_MS = 400;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? DELETE_MS : TYPE_MS;
    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = HOLD_MS;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = GAP_MS;
    }
    setTimeout(tick, delay);
  }
  tick();
}
