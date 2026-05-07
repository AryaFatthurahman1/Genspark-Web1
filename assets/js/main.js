/* ObsidianQ — Page interactivity, secondary 3D scenes, animations (Enhanced Edition) */

(function () {
  /* ====================================================================== */
  /* Loading screen                                                         */
  /* ====================================================================== */
  var loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loadingScreen.classList.add('hidden');
      }, 2200);
    });
  }

  /* ====================================================================== */
  /* Custom cursor glow                                                     */
  /* ====================================================================== */
  var cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    var cursorVisible = false;
    document.addEventListener('mousemove', function (e) {
      if (!cursorVisible) {
        cursorGlow.classList.add('visible');
        cursorVisible = true;
      }
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  /* ====================================================================== */
  /* Navbar scroll state                                                    */
  /* ====================================================================== */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  var burger = document.querySelector('.nav-burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileClose = document.querySelector('.mobile-menu .close');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () { mobileMenu.classList.add('open'); });
    if (mobileClose) mobileClose.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
    });
  }

  /* ====================================================================== */
  /* Reveal on scroll                                                       */
  /* ====================================================================== */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ====================================================================== */
  /* Animated bars (sustainability)                                         */
  /* ====================================================================== */
  var bars = document.querySelectorAll('.bar .fill');
  if (bars.length && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var fill = entry.target;
            fill.style.width = fill.dataset.value + '%';
            io2.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach(function (b) { io2.observe(b); });
  }

  /* ====================================================================== */
  /* Live qubit grid in hero panel                                          */
  /* ====================================================================== */
  var qubitGrid = document.querySelector('.qubit-grid');
  if (qubitGrid) {
    var total = 28 * 8;
    for (var i = 0; i < total; i++) {
      var q = document.createElement('div');
      q.className = 'qubit';
      qubitGrid.appendChild(q);
    }
    var qubits = qubitGrid.querySelectorAll('.qubit');
    function updateQubits() {
      qubits.forEach(function (q) {
        q.classList.remove('active', 'entangled');
        var r = Math.random();
        if (r < 0.18) q.classList.add('active');
        else if (r < 0.24) q.classList.add('entangled');
      });
    }
    updateQubits();
    setInterval(updateQubits, 1100);
  }

  /* ====================================================================== */
  /* Animated counters                                                      */
  /* ====================================================================== */
  function animateCount(el, end, duration, suffix) {
    duration = duration || 1400;
    suffix = suffix || '';
    var start = parseFloat(el.dataset.start || '0');
    var startTime = performance.now();
    var isFloat = String(end).indexOf('.') !== -1;
    function frame(now) {
      var p = Math.min(1, (now - startTime) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = start + (end - start) * eased;
      el.textContent = (isFloat ? v.toFixed(2) : Math.round(v).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var end = parseFloat(el.dataset.count);
            var suffix = el.dataset.suffix || '';
            animateCount(el, end, 1500, suffix);
            io3.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { io3.observe(c); });
  }

  /* ====================================================================== */
  /* Tagline carousel                                                       */
  /* ====================================================================== */
  var taglines = document.querySelectorAll('.tagline');
  if (taglines.length > 1) {
    var currentTagline = 0;
    setInterval(function () {
      taglines[currentTagline].classList.remove('active');
      currentTagline = (currentTagline + 1) % taglines.length;
      taglines[currentTagline].classList.add('active');
    }, 3500);
  }

  /* ====================================================================== */
  /* Smooth section scroll links                                            */
  /* ====================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          var top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ====================================================================== */
  /* Parallax effect for sections                                           */
  /* ====================================================================== */
  var parallaxSections = document.querySelectorAll('.infra-visual, .showcase-visual');
  if (parallaxSections.length && window.innerWidth > 768) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      parallaxSections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var offset = (rect.top - window.innerHeight / 2) * 0.03;
          section.style.transform = 'translateY(' + offset + 'px)';
        }
      });
    }, { passive: true });
  }

  /* ====================================================================== */
  /* Active nav link highlight on scroll                                    */
  /* ====================================================================== */
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');
  if (navLinks.length && sections.length) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 120;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        var link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            link.style.color = '#fff';
            link.style.background = 'rgba(76, 201, 255, 0.08)';
          } else {
            link.style.color = '';
            link.style.background = '';
          }
        }
      });
    }, { passive: true });
  }

  /* ====================================================================== */
  /* Qubit lattice — Quantum Infrastructure section                         */
  /* ====================================================================== */
  function initQubitLattice() {
    var container = document.getElementById('qubit-lattice');
    if (!container || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 18);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var group = new THREE.Group();
    scene.add(group);

    var latticeQubits = [];
    var size = 8;
    var spacing = 1.2;
    var offset = ((size - 1) * spacing) / 2;
    var sphereGeom = new THREE.SphereGeometry(0.12, 12, 12);

    for (var x = 0; x < size; x++) {
      for (var y = 0; y < size; y++) {
        for (var z = 0; z < size; z++) {
          var isActive = Math.random() > 0.55;
          var color = isActive ? (Math.random() > 0.5 ? 0x4cc9ff : 0x00f5ff) : 0x1a2940;
          var mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: isActive ? 0.95 : 0.5
          });
          var m = new THREE.Mesh(sphereGeom, mat);
          m.position.set(x * spacing - offset, y * spacing - offset, z * spacing - offset);
          m.userData.active = isActive;
          group.add(m);
          latticeQubits.push(m);
        }
      }
    }

    var lineGeom = new THREE.BufferGeometry();
    var linePositions = [];
    for (var x2 = 0; x2 < size; x2++) {
      for (var y2 = 0; y2 < size; y2++) {
        for (var z2 = 0; z2 < size; z2++) {
          var idx = (x2 * size + y2) * size + z2;
          var a = latticeQubits[idx].position;
          if (x2 < size - 1) {
            var b = latticeQubits[((x2 + 1) * size + y2) * size + z2].position;
            linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
          if (y2 < size - 1) {
            var b2 = latticeQubits[(x2 * size + (y2 + 1)) * size + z2].position;
            linePositions.push(a.x, a.y, a.z, b2.x, b2.y, b2.z);
          }
          if (z2 < size - 1) {
            var b3 = latticeQubits[(x2 * size + y2) * size + (z2 + 1)].position;
            linePositions.push(a.x, a.y, a.z, b3.x, b3.y, b3.z);
          }
        }
      }
    }
    lineGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.1
    });
    group.add(new THREE.LineSegments(lineGeom, lineMat));

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    var clock = new THREE.Clock();
    var pulseAccum = 0;
    function tick() {
      var dt = clock.getDelta();
      var t = clock.getElapsedTime();
      group.rotation.y += dt * 0.15;
      group.rotation.x = Math.sin(t * 0.2) * 0.12;
      pulseAccum += dt;
      if (pulseAccum > 0.6) {
        pulseAccum = 0;
        latticeQubits.forEach(function (q) {
          if (Math.random() > 0.9) {
            q.userData.active = !q.userData.active;
            var colors = [0x4cc9ff, 0x9b5de5, 0x00f5ff];
            q.material.color.setHex(q.userData.active ? colors[Math.floor(Math.random() * 3)] : 0x1a2940);
            q.material.opacity = q.userData.active ? 0.95 : 0.5;
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
    var container = document.getElementById('constraint-graph');
    if (!container || typeof THREE === 'undefined') return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 14);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var group = new THREE.Group();
    scene.add(group);

    var nodeCount = 80;
    var radius = 5.0;
    var nodes = [];
    var sphereGeom = new THREE.SphereGeometry(0.14, 14, 14);
    for (var i = 0; i < nodeCount; i++) {
      var phi = Math.acos(-1 + (2 * i) / nodeCount);
      var theta = Math.sqrt(nodeCount * Math.PI) * phi;
      var x = radius * Math.cos(theta) * Math.sin(phi);
      var y = radius * Math.sin(theta) * Math.sin(phi);
      var z = radius * Math.cos(phi);
      var colorChoices = [0x9b5de5, 0x4cc9ff, 0x00f5ff, 0xff2bd6];
      var color = colorChoices[i % colorChoices.length];
      var m = new THREE.Mesh(
        sphereGeom,
        new THREE.MeshBasicMaterial({ color: color })
      );
      m.position.set(x, y, z);
      group.add(m);
      nodes.push(m);
    }

    var lineGeom = new THREE.BufferGeometry();
    var linePos = [];
    for (var j = 0; j < nodes.length; j++) {
      var a = nodes[j].position;
      var dists = nodes
        .map(function (n, idx) { return { idx: idx, d: a.distanceTo(n.position) }; })
        .filter(function (item) { return item.idx !== j; })
        .sort(function (a2, b2) { return a2.d - b2.d; })
        .slice(0, 3);
      dists.forEach(function (d) {
        var b = nodes[d.idx].position;
        linePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      });
    }
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.18
    });
    group.add(new THREE.LineSegments(lineGeom, lineMat));

    var coreInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshBasicMaterial({
        color: 0x9b5de5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      })
    );
    group.add(coreInner);

    var coreOuter = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 1),
      new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      })
    );
    group.add(coreOuter);

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    var clock = new THREE.Clock();
    function tick() {
      var t = clock.getElapsedTime();
      group.rotation.y = t * 0.15;
      group.rotation.x = Math.sin(t * 0.35) * 0.2;
      coreInner.rotation.x = t * 0.5;
      coreInner.rotation.y = -t * 0.3;
      coreInner.scale.setScalar(1 + Math.sin(t * 1.6) * 0.1);
      coreOuter.rotation.x = -t * 0.3;
      coreOuter.rotation.z = t * 0.2;
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
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
