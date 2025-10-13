(function () {
  // Mobile menu toggle
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Dark mode toggle
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  function setTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  }
  // Initialize theme icon
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') setTheme('dark');
  } catch (e) {}

  // Year in footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll animations (IntersectionObserver)
  var observersSupported = 'IntersectionObserver' in window;
  if (observersSupported) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Content is visible by default; no-op
  }

  // Projects rendering
  var projectsGrid = document.getElementById('projectsGrid');
  function renderProjects(projects) {
    console.log('renderProjects called with:', projects);
    if (!projectsGrid) {
      console.log('projectsGrid not found');
      return;
    }
    if (!Array.isArray(projects)) {
      console.log('projects is not an array:', projects);
      return;
    }
    console.log('Rendering', projects.length, 'projects');
    projectsGrid.innerHTML = projects
      .map(function (p) {
        var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ');
        return (
          '<article class="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">' +
          (p.image ? '<img src="' + p.image + '" alt="' + (p.title || '') + '" class="w-full h-40 object-cover rounded-lg mb-4" />' : '') +
          '<h3 class="font-semibold text-lg mb-1">' + (p.title || 'Untitled') + '</h3>' +
          '<p class="text-sm text-slate-600 dark:text-slate-300 mb-3">' + (p.description || '') + '</p>' +
          '<div class="flex flex-wrap gap-2 mb-3">' + tags + '</div>' +
          '<div class="flex items-center gap-3 text-sm">' +
          (p.demo ? '<a class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer" href="' + p.demo + '">Demo</a>' : '') +
          (p.source ? '<a class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noreferrer" href="' + p.source + '">Source</a>' : '') +
          '</div>' +
          '</article>'
        );
      })
      .join('');
  }

  if (projectsGrid) {
    // Fallback projects data
    var fallbackProjects = [
      {
        title: 'Harf ba Harf — Urdu Transcription & Diarization',
        description: 'Flutter app with FastAPI backend for Urdu ASR (Whisper large-v3-turbo), diarization (pyannote), and summarization (fine-tuned MBart).',
        tags: ['Flutter', 'FastAPI', 'Whisper', 'pyannote', 'MBart'],
        demo: '',
        source: 'https://github.com/tk-474'
      },
      {
        title: 'LoRA Fine-Tuning TinyLLaMA (SFT + DPO)',
        description: 'Evaluated 5 LoRA configs on Dolly-15k; performed DPO on Argilla UltraFeedback; achieved 14% perplexity reduction with best trial.',
        tags: ['TinyLLaMA', 'LoRA', 'SFT', 'DPO', 'HuggingFace'],
        demo: '',
        source: 'https://github.com/tk-474'
      },
      {
        title: 'RAG for Design & Analysis of Algorithms',
        description: 'Hybrid retrieval using FAISS + BM25 with RRF; LLM-generated, context-grounded answers and custom evaluation framework.',
        tags: ['RAG', 'FAISS', 'BM25', 'RRR', 'LLMs'],
        demo: '',
        source: 'https://github.com/tk-474'
      },
      {
        title: 'Big Data Analytics & Dashboarding',
        description: 'End-to-end big data pipeline with Kafka, HDFS, Spark, and HBase. Interactive dashboards using Flask and Plotly for sales analytics.',
        tags: ['Kafka', 'HDFS', 'Spark', 'HBase', 'Flask', 'Plotly'],
        demo: '',
        source: 'https://github.com/tk-474'
      },
      {
        title: 'Music Management Library (Groovy)',
        description: 'Full-stack music library with React frontend, Node.js backend, and Oracle database. Features advanced CSS animations and database management.',
        tags: ['React', 'Node.js', 'Oracle', 'CSS', 'JavaScript'],
        demo: '',
        source: 'https://github.com/tk-474'
      },
      {
        title: 'Event Management System (Ticketopia)',
        description: 'Scrum-based event management platform built with React, Express, Node.js, and PostgreSQL. Complete event ticketing and management solution.',
        tags: ['React', 'Express', 'Node.js', 'PostgreSQL', 'Scrum'],
        demo: '',
        source: 'https://github.com/tk-474'
      }
    ];

    // Try to load from JSON, fallback to inline data
    fetch('assets/js/projects.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (projects) { 
        console.log('Loaded projects from JSON:', projects);
        renderProjects(projects); 
      })
      .catch(function (error) { 
        console.log('JSON fetch failed, using fallback:', error);
        renderProjects(fallbackProjects); 
      });
  }

  // Contact form UX
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(contactForm);
      formStatus.textContent = 'Sending…';
      fetch(contactForm.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function () { formStatus.textContent = 'Thanks! I will get back to you soon.'; contactForm.reset(); })
        .catch(function () { formStatus.textContent = 'Something went wrong. Please email me instead.'; });
    });
  }

  // Global Three.js background animation
  var globalThreeContainer = document.getElementById('global-three-container');
  if (globalThreeContainer && window.THREE) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, globalThreeContainer.clientWidth / globalThreeContainer.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(globalThreeContainer.clientWidth, globalThreeContainer.clientHeight);
    globalThreeContainer.appendChild(renderer.domElement);

    // Enhanced particle system for full page
    var particleCount = 2000;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400; // x - wider spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300; // y - taller spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z - deeper spread
      
      // Random colors
      colors[i * 3 + 0] = Math.random() * 0.5 + 0.3; // r
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.4; // g
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.8; // b
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var material = new THREE.PointsMaterial({ 
      size: 1.2, 
      vertexColors: true,
      transparent: true, 
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    var points = new THREE.Points(geometry, material);
    scene.add(points);

    // Add floating geometric shapes
    var shapes = [];
    for (var i = 0; i < 8; i++) {
      var geometry = new THREE.IcosahedronGeometry(2, 0);
      var material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      var shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 100
      );
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(shape);
      shapes.push(shape);
    }

    // Subtle colored fog depending on theme
    var isDark = document.documentElement.classList.contains('dark');
    scene.fog = new THREE.Fog(isDark ? 0x0f172a : 0xf8fafc, 100, 220);

    // Resize handling
    function onResize() {
      var w = globalThreeContainer.clientWidth;
      var h = globalThreeContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Pause when tab hidden
    var isPaused = false;
    document.addEventListener('visibilitychange', function () {
      isPaused = document.hidden;
    });

    // Animate
    var clock = new THREE.Clock();
    function animate() {
      if (!isPaused) {
        var t = clock.getElapsedTime();
        
        // Animate particles
        points.rotation.y = t * 0.03;
        points.rotation.x = Math.sin(t * 0.1) * 0.02;
        
        // Animate geometric shapes
        shapes.forEach(function(shape, index) {
          shape.rotation.x += 0.01 * (index + 1);
          shape.rotation.y += 0.015 * (index + 1);
          shape.position.y += Math.sin(t + index) * 0.02;
        });
        
        // Slow camera movement
        camera.position.x = Math.sin(t * 0.05) * 10;
        camera.position.y = Math.cos(t * 0.03) * 5;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    }
    onResize();
    animate();

    // Update fog on theme change
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var nowDark = document.documentElement.classList.contains('dark');
        scene.fog = new THREE.Fog(nowDark ? 0x0f172a : 0xf8fafc, 100, 220);
        material.color = new THREE.Color(nowDark ? 0x93c5fd : 0x3b82f6);
      });
    }
  }
})();


