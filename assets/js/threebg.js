// Global animated background: starfield + neural "plexus" network + wireframe shapes.
// Reacts to mouse (parallax), scroll (rotation/zoom), and theme changes.
export function initThreeBackground() {
  const container = document.getElementById('global-three-container');
  if (!container || !window.THREE) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 70;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Theme palettes
  const palettes = {
    dark: {
      fog: 0x05070f,
      starColors: [new THREE.Color(0x818cf8), new THREE.Color(0x22d3ee), new THREE.Color(0xc4b5fd)],
      nodeColor: new THREE.Color(0x93c5fd),
      lineColor: new THREE.Color(0x6366f1),
      shapeColors: [0x6366f1, 0x22d3ee, 0xa855f7],
      starOpacity: 0.8,
      lineOpacity: 1.0,
      blending: THREE.AdditiveBlending,
    },
    light: {
      fog: 0xf8fafc,
      starColors: [new THREE.Color(0x6366f1), new THREE.Color(0x0891b2), new THREE.Color(0x7c3aed)],
      nodeColor: new THREE.Color(0x4f46e5),
      lineColor: new THREE.Color(0x6366f1),
      shapeColors: [0x4f46e5, 0x0891b2, 0x7c3aed],
      starOpacity: 0.45,
      lineOpacity: 0.35,
      blending: THREE.NormalBlending,
    },
  };
  const isDark = () => document.documentElement.classList.contains('dark');

  // ---------- Starfield ----------
  const STAR_COUNT = 1400;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  const starColors = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPositions[i * 3 + 0] = (Math.random() - 0.5) * 420;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 240 - 40;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  const starMaterial = new THREE.PointsMaterial({
    size: 1.1,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // ---------- Neural plexus network ----------
  const NODE_COUNT = 90;
  const CONNECT_DIST = 22;
  const BOUNDS = { x: 90, y: 55, z: 35 };

  const plexus = new THREE.Group();
  scene.add(plexus);

  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 2 * BOUNDS.x,
        (Math.random() - 0.5) * 2 * BOUNDS.y,
        (Math.random() - 0.5) * 2 * BOUNDS.z
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.045,
        (Math.random() - 0.5) * 0.045,
        (Math.random() - 0.5) * 0.03
      ),
    });
  }

  const nodePositions = new Float32Array(NODE_COUNT * 3);
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
  const nodeMaterial = new THREE.PointsMaterial({
    size: 2.0,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  plexus.add(new THREE.Points(nodeGeometry, nodeMaterial));

  // Pre-allocate the maximum number of line segments; draw only the active ones.
  const MAX_SEGMENTS = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linePositions = new Float32Array(MAX_SEGMENTS * 2 * 3);
  const lineColors = new Float32Array(MAX_SEGMENTS * 2 * 3);
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  plexus.add(lines);

  function updatePlexus() {
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      n.pos.add(n.vel);
      if (Math.abs(n.pos.x) > BOUNDS.x) n.vel.x *= -1;
      if (Math.abs(n.pos.y) > BOUNDS.y) n.vel.y *= -1;
      if (Math.abs(n.pos.z) > BOUNDS.z) n.vel.z *= -1;
      nodePositions[i * 3 + 0] = n.pos.x;
      nodePositions[i * 3 + 1] = n.pos.y;
      nodePositions[i * 3 + 2] = n.pos.z;
    }
    nodeGeometry.attributes.position.needsUpdate = true;

    const palette = isDark() ? palettes.dark : palettes.light;
    const c = palette.lineColor;
    let segment = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < CONNECT_DIST) {
          // Fade lines out with distance (encoded in vertex color brightness).
          const strength = (1 - dist / CONNECT_DIST) * palette.lineOpacity;
          const v = segment * 6;
          linePositions[v + 0] = nodes[i].pos.x;
          linePositions[v + 1] = nodes[i].pos.y;
          linePositions[v + 2] = nodes[i].pos.z;
          linePositions[v + 3] = nodes[j].pos.x;
          linePositions[v + 4] = nodes[j].pos.y;
          linePositions[v + 5] = nodes[j].pos.z;
          for (let k = 0; k < 2; k++) {
            lineColors[v + k * 3 + 0] = c.r * strength;
            lineColors[v + k * 3 + 1] = c.g * strength;
            lineColors[v + k * 3 + 2] = c.b * strength;
          }
          segment++;
        }
      }
    }
    lineGeometry.setDrawRange(0, segment * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
  }

  // ---------- Floating wireframe shapes ----------
  const shapes = [];
  const shapeGeometries = [
    new THREE.IcosahedronGeometry(7, 0),
    new THREE.OctahedronGeometry(5, 0),
    new THREE.TorusKnotGeometry(4, 1.1, 64, 8),
  ];
  for (let i = 0; i < 3; i++) {
    const material = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.12 });
    const shape = new THREE.Mesh(shapeGeometries[i], material);
    shape.position.set((i - 1) * 65 + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 60, -30 - Math.random() * 30);
    scene.add(shape);
    shapes.push(shape);
  }

  // ---------- Theme handling ----------
  function applyTheme() {
    const palette = isDark() ? palettes.dark : palettes.light;
    scene.fog = new THREE.Fog(palette.fog, 110, 260);
    starMaterial.opacity = palette.starOpacity;
    starMaterial.blending = palette.blending;
    starMaterial.needsUpdate = true;
    lineMaterial.blending = palette.blending;
    lineMaterial.needsUpdate = true;
    nodeMaterial.color = palette.nodeColor.clone();
    nodeMaterial.blending = palette.blending;
    nodeMaterial.needsUpdate = true;
    for (let i = 0; i < STAR_COUNT; i++) {
      const color = palette.starColors[i % palette.starColors.length];
      starColors[i * 3 + 0] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
    starGeometry.attributes.color.needsUpdate = true;
    shapes.forEach((shape, i) => {
      shape.material.color.setHex(palette.shapeColors[i % palette.shapeColors.length]);
      shape.material.opacity = isDark() ? 0.12 : 0.08;
    });
  }
  applyTheme();
  window.addEventListener('themechange', () => {
    applyTheme();
    if (prefersReducedMotion) renderOnce();
  });

  // ---------- Interaction state ----------
  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = window.scrollY / max;
  }, { passive: true });

  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (prefersReducedMotion) renderOnce();
  }
  window.addEventListener('resize', onResize);

  let isPaused = false;
  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
  });

  function renderOnce() {
    updatePlexus();
    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    onResize();
    renderOnce();
    return;
  }

  // ---------- Animation loop ----------
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (isPaused) return;

    const t = clock.getElapsedTime();
    updatePlexus();

    stars.rotation.y = t * 0.012;
    stars.rotation.x = Math.sin(t * 0.08) * 0.015;

    plexus.rotation.y = t * 0.02 + scrollProgress * Math.PI * 0.5;
    plexus.rotation.x = scrollProgress * 0.25;

    shapes.forEach((shape, i) => {
      shape.rotation.x += 0.0015 * (i + 1);
      shape.rotation.y += 0.002 * (i + 1);
      shape.position.y += Math.sin(t * 0.5 + i * 2) * 0.015;
    });

    // Mouse parallax + gentle scroll zoom, eased.
    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.03;
    camera.position.z = 70 - scrollProgress * 12;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  onResize();
  animate();
}
