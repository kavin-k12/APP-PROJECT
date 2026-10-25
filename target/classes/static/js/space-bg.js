/**
 * CAMPUS CONNECT 2030 — THREE.JS 3D SPACE ENVIRONMENT
 * Provides dynamic 3D celestial planet, orbital rings, twinkling starfield,
 * nebula dust particles, and mouse-parallax interaction.
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const container = document.getElementById('space-canvas-container');
  if (!container || prefersReducedMotion) {
    return;
  }

  // Ensure Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not detected; falling back to CSS starfield.');
    return;
  }

  let scene, camera, renderer;
  let planet, atmosphere, ringSystem, stars, nebulaParticles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050711, 0.0012);

    // Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 400;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.id = 'space-webgl-canvas';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1024, 2.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x00e5ff, 3.0);
    sunLight.position.set(200, 150, 300);
    scene.add(sunLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 4.0, 800);
    violetLight.position.set(-250, -100, 150);
    scene.add(violetLight);

    createStarfield();
    createCelestialCampusWorld();
    createOrbitalRings();
    createNebulaDust();

    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize);

    animate();
  }

  function createStarfield() {
    const starCount = window.innerWidth < 768 ? 1200 : 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorCyan = new THREE.Color(0x00e5ff);
    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorWhite = new THREE.Color(0xeaf4ff);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1800;
      positions[i + 1] = (Math.random() - 0.5) * 1800;
      positions[i + 2] = (Math.random() - 0.5) * 1800;

      const rand = Math.random();
      let chosenColor = colorWhite;
      if (rand > 0.75) chosenColor = colorCyan;
      else if (rand > 0.5) chosenColor = colorViolet;

      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    stars = new THREE.Points(geometry, material);
    scene.add(stars);
  }

  function createCelestialCampusWorld() {
    // Procedural wireframe / tech globe representing the 2030 Campus Space Station World
    const radius = 95;
    const geometry = new THREE.SphereGeometry(radius, 40, 40);

    const material = new THREE.MeshPhongMaterial({
      color: 0x070c20,
      emissive: 0x051329,
      specular: 0x00e5ff,
      shininess: 45,
      wireframe: false,
      transparent: true,
      opacity: 0.92
    });

    planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, -50);
    scene.add(planet);

    // Glowing wireframe grid cage around the planet
    const wireGeo = new THREE.SphereGeometry(radius + 1.2, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    planet.add(wireSphere);

    // Atmosphere halo
    const atmosGeo = new THREE.SphereGeometry(radius + 12, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    planet.add(atmosphere);
  }

  function createOrbitalRings() {
    ringSystem = new THREE.Group();

    // Primary orbital ring
    const ringGeo = new THREE.RingGeometry(125, 138, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.3;
    ring1.rotation.y = Math.PI / 8;
    ringSystem.add(ring1);

    // Outer ultraviolet resonant ring
    const ringGeo2 = new THREE.RingGeometry(152, 155, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 8;
    ringSystem.add(ring2);

    planet.add(ringSystem);
  }

  function createNebulaDust() {
    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = (Math.random() - 0.5) * 600;
      positions[i + 2] = (Math.random() - 0.5) * 600;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 3.5,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    nebulaParticles = new THREE.Points(geometry, material);
    scene.add(nebulaParticles);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse parallax easing
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.4;
    camera.position.y = -targetY * 0.4;
    camera.lookAt(scene.position);

    // Planet rotation
    if (planet) {
      planet.rotation.y += 0.0025;
      planet.rotation.x += 0.0005;
    }

    // Stars gentle drift
    if (stars) {
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;
    }

    // Nebula subtle oscillation
    if (nebulaParticles) {
      nebulaParticles.rotation.y -= 0.0008;
    }

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
