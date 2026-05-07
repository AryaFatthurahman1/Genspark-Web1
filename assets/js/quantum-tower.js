/* ObsidianQ — Hero floating quantum tower (Enhanced Edition)
   Pure Three.js, no external loaders. Procedurally builds an anti-gravity
   monolithic tower with energy core, holographic rings, data streams,
   levitating platforms, and ambient particles with cinematic lighting. */

(function () {
  const container = document.getElementById('quantum-tower');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04050a, 0.016);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 4, 36);
  camera.lookAt(0, 4, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  /* Lights — cinematic setup */
  scene.add(new THREE.AmbientLight(0x1a2940, 0.45));

  const keyLight = new THREE.DirectionalLight(0x4cc9ff, 1.6);
  keyLight.position.set(10, 14, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9b5de5, 1.2);
  rimLight.position.set(-12, 8, -6);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0x00f5ff, 0.4);
  fillLight.position.set(0, -10, 5);
  scene.add(fillLight);

  const coreLight = new THREE.PointLight(0x00f5ff, 2.8, 60, 1.6);
  coreLight.position.set(0, 4, 0);
  scene.add(coreLight);

  const topLight = new THREE.PointLight(0xd4af37, 1.2, 30, 1.8);
  topLight.position.set(0, 18, 0);
  scene.add(topLight);

  /* Tower group */
  const tower = new THREE.Group();
  scene.add(tower);

  /* Build tower from stacked beveled blocks */
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c0f17,
    metalness: 0.88,
    roughness: 0.28,
    emissive: 0x0a1422,
    emissiveIntensity: 0.4
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2a44,
    metalness: 0.95,
    roughness: 0.18,
    emissive: 0x4cc9ff,
    emissiveIntensity: 0.55
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.22,
    emissive: 0x4a3b15,
    emissiveIntensity: 0.5
  });

  const carbonFiberMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0d14,
    metalness: 0.92,
    roughness: 0.15,
    emissive: 0x060810,
    emissiveIntensity: 0.3
  });

  const segments = 14;
  let yCursor = -9;
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const baseW = 6.0 - t * 1.8;
    const baseD = 3.6 - t * 1.0;
    const h = i === 0 ? 1.4 : (i === segments - 1 ? 2.4 : 1.3);
    const mat = i % 3 === 0 ? carbonFiberMaterial : blockMaterial;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(baseW, h, baseD),
      mat
    );
    block.position.y = yCursor + h / 2;
    tower.add(block);

    if (i < segments - 1) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(baseW + 0.2, 0.06, baseD + 0.2),
        accentMaterial
      );
      line.position.y = yCursor + h + 0.04;
      tower.add(line);

      const stripGeom = new THREE.BoxGeometry(0.05, h * 0.7, 0.05);
      const stripMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4cc9ff : 0x9b5de5,
        transparent: true,
        opacity: 0.9
      });
      const offsets = [
        [baseW / 2 + 0.04, baseD / 2 + 0.04],
        [-baseW / 2 - 0.04, baseD / 2 + 0.04],
        [baseW / 2 + 0.04, -baseD / 2 - 0.04],
        [-baseW / 2 - 0.04, -baseD / 2 - 0.04]
      ];
      offsets.forEach(function (coords) {
        var x = coords[0], z = coords[1];
        const strip = new THREE.Mesh(stripGeom, stripMat);
        strip.position.set(x, yCursor + h / 2, z);
        tower.add(strip);
      });

      if (i % 3 === 1) {
        var windowGeom = new THREE.PlaneGeometry(baseW * 0.6, h * 0.3);
        var windowMat = new THREE.MeshBasicMaterial({
          color: 0x4cc9ff,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide
        });
        var windowMesh = new THREE.Mesh(windowGeom, windowMat);
        windowMesh.position.set(0, yCursor + h / 2, baseD / 2 + 0.02);
        tower.add(windowMesh);
      }
    }

    yCursor += h + 0.05;
  }

  /* Top spire with antenna */
  const spire = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 5.0, 6),
    goldMaterial
  );
  spire.position.y = yCursor + 2.2;
  tower.add(spire);

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 3, 8),
    new THREE.MeshBasicMaterial({ color: 0xd4af37 })
  );
  antenna.position.y = yCursor + 6.0;
  tower.add(antenna);

  const spireTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f5ff })
  );
  spireTip.position.y = yCursor + 7.5;
  tower.add(spireTip);

  /* Energy core inside tower */
  const coreGeom = new THREE.IcosahedronGeometry(1.2, 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  core.position.y = 0;
  tower.add(core);

  const coreInner = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  coreInner.position.y = 0;
  tower.add(coreInner);

  /* Secondary core shell */
  const coreShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 1),
    new THREE.MeshBasicMaterial({
      color: 0x9b5de5,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
  );
  coreShell.position.y = 0;
  tower.add(coreShell);

  /* Glow halo around core */
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x4cc9ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), haloMat);
  halo.position.y = 0;
  tower.add(halo);

  /* Levitating rings around tower */
  const rings = [];
  for (let i = 0; i < 6; i++) {
    const radius = 5.5 + i * 0.5;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.04, 8, 96),
      new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x00f5ff : (i % 3 === 1 ? 0x4cc9ff : 0x9b5de5),
        transparent: true,
        opacity: 0.35 - i * 0.04
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -9 + i * 0.5;
    rings.push(ring);
    tower.add(ring);
  }

  /* Floating platform fragments (anti-gravity) */
  const platforms = [];
  for (let i = 0; i < 20; i++) {
    const w = 0.5 + Math.random() * 1.4;
    const d = 0.5 + Math.random() * 1.2;
    const h = 0.06 + Math.random() * 0.08;
    const plat = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: 0x10141d,
        metalness: 0.9,
        roughness: 0.35,
        emissive: i % 3 === 0 ? 0x9b5de5 : 0x4cc9ff,
        emissiveIntensity: 0.2
      })
    );
    const angle = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 8;
    plat.position.set(
      Math.cos(angle) * r,
      -11 - Math.random() * 5,
      Math.sin(angle) * r
    );
    plat.rotation.y = Math.random() * Math.PI;
    plat.userData.basY = plat.position.y;
    plat.userData.phase = Math.random() * Math.PI * 2;
    plat.userData.speed = 0.4 + Math.random() * 0.4;
    platforms.push(plat);
    scene.add(plat);
  }

  /* Particle field — more particles, varied colors */
  const particleCount = 1800;
  const particleGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color();
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = 6 + Math.random() * 28;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 1.6;
    positions[i3] = Math.cos(theta) * r * Math.cos(phi);
    positions[i3 + 1] = (Math.random() - 0.4) * 28;
    positions[i3 + 2] = Math.sin(theta) * r * Math.cos(phi);

    const tone = Math.random();
    if (tone < 0.4) baseColor.setHex(0x4cc9ff);
    else if (tone < 0.7) baseColor.setHex(0x9b5de5);
    else if (tone < 0.9) baseColor.setHex(0x00f5ff);
    else baseColor.setHex(0xff2bd6);
    colors[i3] = baseColor.r;
    colors[i3 + 1] = baseColor.g;
    colors[i3 + 2] = baseColor.b;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  /* Ground glow disc (floor reflection) */
  const groundGlow = new THREE.Mesh(
    new THREE.CircleGeometry(22, 64),
    new THREE.MeshBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    })
  );
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.y = -18;
  scene.add(groundGlow);

  /* Secondary ground glow */
  const groundGlow2 = new THREE.Mesh(
    new THREE.CircleGeometry(14, 64),
    new THREE.MeshBasicMaterial({
      color: 0x9b5de5,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    })
  );
  groundGlow2.rotation.x = -Math.PI / 2;
  groundGlow2.position.y = -17.5;
  scene.add(groundGlow2);

  /* Holographic data streams (vertical lines) */
  const streams = [];
  for (let i = 0; i < 8; i++) {
    const points = [];
    const angle = (i / 8) * Math.PI * 2;
    const r = 6.5;
    for (let j = 0; j < 35; j++) {
      const y = -10 + j * 0.7;
      points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: i % 3 === 0 ? 0x00f5ff : (i % 3 === 1 ? 0x4cc9ff : 0x9b5de5),
      dashSize: 0.4,
      gapSize: 0.3,
      transparent: true,
      opacity: 0.4
    });
    const stream = new THREE.Line(geo, mat);
    stream.computeLineDistances();
    streams.push(stream);
    scene.add(stream);
  }

  /* Orbiting energy orbs */
  const orbs = [];
  for (let i = 0; i < 4; i++) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f5ff : 0x9b5de5,
        transparent: true,
        opacity: 0.9
      })
    );
    orb.userData.orbit = 7 + i * 1.2;
    orb.userData.speed = 0.3 + i * 0.15;
    orb.userData.yBase = -2 + i * 3;
    orbs.push(orb);
    scene.add(orb);
  }

  /* Mouse parallax */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Resize */
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* Animate */
  var clock = new THREE.Clock();
  function animate() {
    var t = clock.getElapsedTime();

    tower.position.y = Math.sin(t * 0.5) * 0.5;
    tower.rotation.y = Math.sin(t * 0.12) * 0.2;

    core.rotation.x = t * 0.7;
    core.rotation.y = t * 0.5;
    coreShell.rotation.x = -t * 0.4;
    coreShell.rotation.z = t * 0.3;
    coreInner.scale.setScalar(1 + Math.sin(t * 2.2) * 0.15);
    halo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.1);
    coreLight.intensity = 2.2 + Math.sin(t * 2.0) * 0.8;

    spireTip.scale.setScalar(1 + Math.sin(t * 3.0) * 0.2);

    rings.forEach(function (ring, i) {
      ring.rotation.z += 0.0007 * (i % 2 === 0 ? 1 : -1);
      ring.position.y = -9 + i * 0.5 + Math.sin(t * 0.5 + i) * 0.2;
    });

    platforms.forEach(function (p) {
      p.position.y = p.userData.basY + Math.sin(t * p.userData.speed + p.userData.phase) * 0.5;
      p.rotation.y += 0.001;
    });

    particles.rotation.y = t * 0.035;

    orbs.forEach(function (orb, i) {
      var angle = t * orb.userData.speed + i * Math.PI * 0.5;
      orb.position.set(
        Math.cos(angle) * orb.userData.orbit,
        orb.userData.yBase + Math.sin(t * 0.8 + i) * 1.5,
        Math.sin(angle) * orb.userData.orbit
      );
    });

    var targetX = mouse.x * 1.8;
    var targetY = 4 + mouse.y * 1.0;
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.lookAt(0, 4, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
