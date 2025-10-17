export function initThreeBackground(themeToggle) {
  const container = document.getElementById('global-three-container');
  if (!container || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 60;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    colors[i * 3 + 0] = Math.random() * 0.5 + 0.3;
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.4;
    colors[i * 3 + 2] = Math.random() * 0.5 + 0.8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const shapes = [];
  for (let i = 0; i < 8; i++) {
    const g = new THREE.IcosahedronGeometry(2, 0);
    const m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6), transparent: true, opacity: 0.1, wireframe: true });
    const shape = new THREE.Mesh(g, m);
    shape.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 100);
    shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(shape);
    shapes.push(shape);
  }

  const nowDark = document.documentElement.classList.contains('dark');
  scene.fog = new THREE.Fog(nowDark ? 0x0f172a : 0xf8fafc, 100, 220);

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let isPaused = false;
  document.addEventListener('visibilitychange', () => { isPaused = document.hidden; });

  // Scroll-reactive effects and section overlay control
  const baseSize = material.size;
  const baseOpacity = material.opacity;
  let scrollTimeoutId = null;
  const overlays = Array.from(document.querySelectorAll('.section-overlay'));

  function boostStars() { material.size = Math.min(baseSize * 2, 3); material.opacity = Math.min(baseOpacity + 0.3, 1); }
  function normalizeStars() { material.size = baseSize; material.opacity = baseOpacity; }
  function highlightCurrentSection() {
    if (!overlays.length) return;
    const viewportCenter = window.scrollY + window.innerHeight * 0.35;
    let activeIndex = -1;
    overlays.forEach((overlay, i) => {
      const sec = overlay.parentElement; if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY; const bottom = top + rect.height;
      if (viewportCenter >= top && viewportCenter < bottom) activeIndex = i;
    });
    overlays.forEach((el, i) => { el.style.opacity = i === activeIndex ? '1' : '0'; });
  }
  window.addEventListener('scroll', () => {
    boostStars(); overlays.forEach((el) => { el.style.opacity = '0'; });
    if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    scrollTimeoutId = setTimeout(() => { normalizeStars(); highlightCurrentSection(); }, 200);
  }, { passive: true });
  highlightCurrentSection();

  const clock = new THREE.Clock();
  function animate() {
    if (!isPaused) {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.03; points.rotation.x = Math.sin(t * 0.1) * 0.02;
      shapes.forEach((shape, i) => { shape.rotation.x += 0.01 * (i + 1); shape.rotation.y += 0.015 * (i + 1); shape.position.y += Math.sin(t + i) * 0.02; });
      camera.position.x = Math.sin(t * 0.05) * 10; camera.position.y = Math.cos(t * 0.03) * 5; camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }
  onResize();
  animate();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const d = document.documentElement.classList.contains('dark');
      scene.fog = new THREE.Fog(d ? 0x0f172a : 0xf8fafc, 100, 220);
      material.color = new THREE.Color(d ? 0x93c5fd : 0x3b82f6);
    });
  }
}


