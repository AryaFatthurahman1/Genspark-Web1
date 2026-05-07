/* ObsidianQ — Hero floating quantum tower
   Pure Three.js, no external loaders. Procedurally builds an anti-gravity
   monolithic tower with energy core, holographic rings and ambient particles. */

(function () {
  const container = document.getElementById('quantum-tower');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x04050a, 0.018);

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
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  /* Lights */
  scene.add(new THREE.AmbientLight(0x1a2940, 0.55));

  const keyLight = new THREE.DirectionalLight(0x4cc9ff, 1.4);
  keyLight.position.set(10, 14, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9b5de5, 1.1);
  rimLight.position.set(-12, 8, -6);
  scene.add(rimLight);

  const coreLight = new THREE.PointLight(0x00f5ff, 2.4, 60, 1.6);
  coreLight.position.set(0, 4, 0);
  scene.add(coreLight);

  /* Tower group */
  const tower = new THREE.Group();
  scene.add(tower);

  /* Build tower from stacked beveled blocks */
  const blockMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c0f17,
    metalness: 0.85,
    roughness: 0.32,
    emissive: 0x0a1422,
    emissiveIntensity: 0.4
  });

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2a44,
    metalness: 0.95,
    roughness: 0.18,
    emissive: 0x4cc9ff,
    emissiveIntensity: 0.5
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.22,
    emissive: 0x4a3b15,
    emissiveIntensity: 0.5
  });

  const segments = 12;
  let yCursor = -8;
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const baseW = 5.6 - t * 1.6;
    const baseD = 3.4 - t * 0.9;
    const h = i === 0 ? 1.2 : (i === segments - 1 ? 2.2 : 1.4);
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(baseW, h, baseD),
      blockMaterial
    );
    block.position.y = yCursor + h / 2;
    tower.add(block);

    // Accent line above the block
    if (i < segments - 1) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(baseW + 0.18, 0.06, baseD + 0.18),
        accentMaterial
      );
      line.position.y = yCursor + h + 0.04;
      tower.add(line);

      // Side glow strips
      const stripGeom = new THREE.BoxGeometry(0.05, h * 0.7, 0.05);
      const stripMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4cc9ff : 0x9b5de5,
        transparent: true,
        opacity: 0.85
      });
      const offsets = [
        [baseW / 2 + 0.04, baseD / 2 + 0.04],
        [-baseW / 2 - 0.04, baseD / 2 + 0.04],
        [baseW / 2 + 0.04, -baseD / 2 - 0.04],
        [-baseW / 2 - 0.04, -baseD / 2 - 0.04]
      ];
      offsets.forEach(([x, z]) => {
        const strip = new THREE.Mesh(stripGeom, stripMat);
        strip.position.set(x, yCursor + h / 2, z);
        tower.add(strip);
      });
    }

    yCursor += h + 0.05;
  }

  /* Top spire */
  const spire = new THREE.Mesh(
    new THREE.ConeGeometry(0.65, 4.5, 6),
    goldMaterial
  );
  spire.position.y = yCursor + 2.0;
  tower.add(spire);

  const spireTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x00f5ff })
  );
  spireTip.position.y = yCursor + 4.4;
  tower.add(spireTip);

  /* Energy core inside tower */
  const coreGeom = new THREE.IcosahedronGeometry(1.0, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.85
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  core.position.y = 0;
  tower.add(core);

  const coreInner = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  coreInner.position.y = 0;
  tower.add(coreInner);

  /* Glow halo around core */
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x4cc9ff,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), haloMat);
  halo.position.y = 0;
  tower.add(halo);

  /* Levitating rings around tower */
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const radius = 5.5 + i * 0.6;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.04, 8, 96),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x4cc9ff : 0x9b5de5,
        transparent: true,
        opacity: 0.4 - i * 0.06
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -8 + i * 0.4;
    rings.push(ring);
    tower.add(ring);
  }

  /* Floating platform fragments below tower (anti-gravity hint) */
  const platforms = [];
  for (let i = 0; i < 14; i++) {
    const w = 0.6 + Math.random() * 1.2;
    const d = 0.6 + Math.random() * 1.0;
    const h = 0.08 + Math.random() * 0.08;
    const plat = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: 0x10141d,
        metalness: 0.9,
        roughness: 0.4,
        emissive: 0x4cc9ff,
        emissiveIntensity: 0.18
      })
    );
    const angle = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 6;
    plat.position.set(
      Math.cos(angle) * r,
      -10 - Math.random() * 4,
      Math.sin(angle) * r
    );
    plat.rotation.y = Math.random() * Math.PI;
    plat.userData.basY = plat.position.y;
    plat.userData.phase = Math.random() * Math.PI * 2;
    platforms.push(plat);
    scene.add(plat);
  }

  /* Particle field */
  const particleCount = 1200;
  const particleGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const baseColor = new THREE.Color();
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = 8 + Math.random() * 24;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 1.4;
    positions[i3] = Math.cos(theta) * r * Math.cos(phi);
    positions[i3 + 1] = (Math.random() - 0.4) * 24;
    positions[i3 + 2] = Math.sin(theta) * r * Math.cos(phi);

    const tone = Math.random();
    if (tone < 0.5) baseColor.setHex(0x4cc9ff);
    else if (tone < 0.85) baseColor.setHex(0x9b5de5);
    else baseColor.setHex(0x00f5ff);
    colors[i3] = baseColor.r;
    colors[i3 + 1] = baseColor.g;
    colors[i3 + 2] = baseColor.b;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.07,
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
    new THREE.CircleGeometry(20, 64),
    new THREE.MeshBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    })
  );
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.y = -16;
  scene.add(groundGlow);

  /* Holographic data streams (vertical lines) */
  const streams = [];
  for (let i = 0; i < 6; i++) {
    const points = [];
    const angle = (i / 6) * Math.PI * 2;
    const r = 6.5;
    for (let j = 0; j < 30; j++) {
      const y = -8 + j * 0.7;
      points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: i % 2 === 0 ? 0x4cc9ff : 0x9b5de5,
      dashSize: 0.4,
      gapSize: 0.3,
      transparent: true,
      opacity: 0.45
    });
    const stream = new THREE.Line(geo, mat);
    stream.computeLineDistances();
    streams.push(stream);
    scene.add(stream);
  }

  /* Mouse parallax */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
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
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    tower.position.y = Math.sin(t * 0.6) * 0.4;
    tower.rotation.y = Math.sin(t * 0.15) * 0.18;

    core.rotation.x = t * 0.6;
    core.rotation.y = t * 0.4;
    coreInner.scale.setScalar(1 + Math.sin(t * 2.0) * 0.12);
    halo.scale.setScalar(1 + Math.sin(t * 1.4) * 0.08);
    coreLight.intensity = 2.0 + Math.sin(t * 2.0) * 0.6;

    rings.forEach((ring, i) => {
      ring.rotation.z += 0.0006 * (i % 2 === 0 ? 1 : -1);
      ring.position.y = -8 + i * 0.4 + Math.sin(t * 0.6 + i) * 0.18;
    });

    platforms.forEach((p, i) => {
      p.position.y = p.userData.basY + Math.sin(t * 0.6 + p.userData.phase) * 0.4;
      p.rotation.y += 0.001;
    });

    particles.rotation.y = t * 0.04;

    // Subtle camera parallax
    const targetX = mouse.x * 1.6;
    const targetY = 4 + mouse.y * 0.8;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 4, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
