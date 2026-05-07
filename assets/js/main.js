/* ObsidianQ — Page interactivity, secondary 3D scenes, and animations */

(function () {
  /* ====================================================================== */
  /* Navbar scroll state                                                    */
  /* ====================================================================== */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu .close');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose && mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
  }

  /* ====================================================================== */
  /* Reveal on scroll                                                       */
  /* ====================================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ====================================================================== */
  /* Animated bars (sustainability)                                         */
  /* ====================================================================== */
  const bars = document.querySelectorAll('.bar .fill');
  if (bars.length && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            fill.style.width = fill.dataset.value + '%';
            io2.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((b) => io2.observe(b));
  }

  /* ====================================================================== */
  /* Live qubit grid in hero panel                                          */
  /* ====================================================================== */
  const qubitGrid = document.querySelector('.qubit-grid');
  if (qubitGrid) {
    const total = 28 * 8;
    for (let i = 0; i < total; i++) {
      const q = document.createElement('div');
      q.className = 'qubit';
      qubitGrid.appendChild(q);
    }
    const qubits = qubitGrid.querySelectorAll('.qubit');
    function updateQubits() {
      qubits.forEach((q) => {
        q.classList.remove('active', 'entangled');
        const r = Math.random();
        if (r < 0.18) q.classList.add('active');
        else if (r < 0.24) q.classList.add('entangled');
      });
    }
    updateQubits();
    setInterval(updateQubits, 1100);
  }

  /* ====================================================================== */
  /* Animated counters in panel rows / kpi                                  */
  /* ====================================================================== */
  function animateCount(el, end, duration = 1400, suffix = '') {
    const start = parseFloat(el.dataset.start || '0');
    const startTime = performance.now();
    const isFloat = String(end).includes('.');
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (end - start) * eased;
      el.textContent = (isFloat ? v.toFixed(2) : Math.round(v).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io3 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const end = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            animateCount(el, end, 1500, suffix);
            io3.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => io3.observe(c));
  }

  /* ====================================================================== */
  /* Smooth section scroll links                                            */
  /* ====================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ====================================================================== */
  /* Qubit lattice — Quantum Infrastructure section                         */
  /* ====================================================================== */
  function initQubitLattice() {
    const container = document.getElementById('qubit-lattice');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const qubits = [];
    const size = 8; // 8x8x8 lattice
    const spacing = 1.2;
    const offset = ((size - 1) * spacing) / 2;
    const sphereGeom = new THREE.SphereGeometry(0.12, 12, 12);

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const isActive = Math.random() > 0.55;
          const mat = new THREE.MeshBasicMaterial({
            color: isActive ? 0x4cc9ff : 0x1a2940,
            transparent: true,
            opacity: isActive ? 0.95 : 0.6
          });
          const m = new THREE.Mesh(sphereGeom, mat);
          m.position.set(x * spacing - offset, y * spacing - offset, z * spacing - offset);
          m.userData.active = isActive;
          group.add(m);
          qubits.push(m);
        }
      }
    }

    // Lattice connections (sparse subset)
    const lineGeom = new THREE.BufferGeometry();
    const linePositions = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const i = (x * size + y) * size + z;
          const a = qubits[i].position;
          if (x < size - 1) {
            const b = qubits[((x + 1) * size + y) * size + z].position;
            linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
          if (y < size - 1) {
            const b = qubits[(x * size + (y + 1)) * size + z].position;
            linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
          if (z < size - 1) {
            const b = qubits[(x * size + y) * size + (z + 1)].position;
            linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        }
      }
    }
    lineGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.12
    });
    group.add(new THREE.LineSegments(lineGeom, lineMat));

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let pulseAccum = 0;
    function tick() {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      group.rotation.y += dt * 0.18;
      group.rotation.x = Math.sin(t * 0.25) * 0.12;
      pulseAccum += dt;
      if (pulseAccum > 0.7) {
        pulseAccum = 0;
        qubits.forEach((q) => {
          if (Math.random() > 0.92) {
            q.userData.active = !q.userData.active;
            q.material.color.setHex(q.userData.active ? 0x9b5de5 : 0x4cc9ff);
            q.material.opacity = q.userData.active ? 1 : 0.85;
          }
        });
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ====================================================================== */
  /* Constraint graph — Solver showcase section                             */
  /* ====================================================================== */
  function initConstraintGraph() {
    const container = document.getElementById('constraint-graph');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Nodes on sphere
    const nodeCount = 60;
    const radius = 4.6;
    const nodes = [];
    const sphereGeom = new THREE.SphereGeometry(0.14, 14, 14);
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      const color = i % 3 === 0 ? 0x9b5de5 : 0x4cc9ff;
      const m = new THREE.Mesh(
        sphereGeom,
        new THREE.MeshBasicMaterial({ color })
      );
      m.position.set(x, y, z);
      group.add(m);
      nodes.push(m);
    }

    // Edges between nearest neighbors
    const lineGeom = new THREE.BufferGeometry();
    const linePos = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i].position;
      // connect to ~3 nearest
      const dists = nodes
        .map((n, idx) => ({ idx, d: a.distanceTo(n.position) }))
        .filter((x) => x.idx !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 3);
      dists.forEach((d) => {
        const b = nodes[d.idx].position;
        linePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      });
    }
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.22
    });
    group.add(new THREE.LineSegments(lineGeom, lineMat));

    // Center core
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0, 1),
      new THREE.MeshBasicMaterial({
        color: 0x9b5de5,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      })
    );
    group.add(core);

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    function tick() {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.18;
      group.rotation.x = Math.sin(t * 0.4) * 0.18;
      core.rotation.x = t * 0.5;
      core.rotation.y = -t * 0.3;
      core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.08);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* Init secondary scenes after Three.js + DOM ready */
  function initScenes() {
    if (typeof THREE === 'undefined') {
      setTimeout(initScenes, 100);
      return;
    }
    initQubitLattice();
    initConstraintGraph();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScenes);
  } else {
    initScenes();
  }

  /* ====================================================================== */
  /* Year stamp                                                              */
  /* ====================================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
