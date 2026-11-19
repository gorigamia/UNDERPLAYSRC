import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(32, 32, 30, 0, Math.PI * 2);
  context.fillStyle = '#ffffff';
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createRainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.moveTo(16, 5);
  context.bezierCurveTo(30, 30, 30, 55, 16, 60);
  context.bezierCurveTo(2, 55, 2, 30, 16, 5);
  const gradient = context.createRadialGradient(16, 40, 0, 16, 40, 20);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
  context.fillStyle = gradient;
  context.fill();
  context.beginPath();
  context.arc(16, 22, 3, 0, Math.PI * 2);
  context.fillStyle = 'rgba(255, 255, 255, 0.95)';
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export default function WeatherBackground({ forceTime }) {
  const containerRef = useRef(null);
  const [weather, setWeather] = useState({ isRaining: false, loaded: false });

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await (await fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true')).json();
        const code = data.current_weather?.weathercode;
        const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code);
        setWeather({ isRaining, loaded: true });
      } catch {
        setWeather({ isRaining: false, loaded: true });
      }
    }
    fetchWeather();
  }, []);

  useEffect(() => {
    if (!weather.loaded || !containerRef.current) return;

    const isRaining = weather.isRaining;
    const themed = ['night', 'orange', 'blue', 'green', 'red', 'pink'].includes(forceTime);
    const isMorning = forceTime === 'morning';

    if (!isRaining && !themed && !isMorning) {
      while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power', premultipliedAlpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild);
    containerRef.current.appendChild(renderer.domElement);

    const systems = [];
    let glowTexture = null;
    let rainTexture = null;
    let starField = null;

    if (themed && !isRaining) {
      glowTexture = glowTexture || createGlowTexture();
      const geometry = new THREE.BufferGeometry();
      const count = 350;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, map: glowTexture, transparent: true, opacity: 0.7, depthWrite: false });
      starField = new THREE.Points(geometry, material);
      scene.add(starField);
    }

    let dustField = null;
    if (isMorning && !isRaining) {
      glowTexture = glowTexture || createGlowTexture();
      const geometry = new THREE.BufferGeometry();
      const count = 80;
      const positions = new Float32Array(count * 3);
      const velocities = [];
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
        velocities.push({ x: (Math.random() - 0.2) * 0.01, y: 0.004 + Math.random() * 0.008 });
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xfff3c4, size: 0.08, map: glowTexture, transparent: true, opacity: 0.6, depthWrite: false });
      dustField = new THREE.Points(geometry, material);
      scene.add(dustField);
      systems.push({ type: 'dust', system: dustField, velocities });
    }

    let rainField = null;
    if (isRaining) {
      rainTexture = rainTexture || createRainTexture();
      const geometry = new THREE.BufferGeometry();
      const count = 350;
      const positions = new Float32Array(count * 3);
      const velocities = [];
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = Math.random() * 30 - 15;
        positions[i * 3 + 2] = -2;
        velocities.push(0.004 + Math.random() * 0.008);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, map: rainTexture, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending });
      rainField = new THREE.Points(geometry, material);
      scene.add(rainField);
      systems.push({ type: 'rain', system: rainField, velocities });
    }

    let frame;
    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    function animate() {
      frame = requestAnimationFrame(animate);
      if (!visible) return;

      const bass = (window.bassValue || 0) / 255;
      if (starField) starField.rotation.y += 0.0002;

      if (dustField) {
        const positions = dustField.geometry.attributes.position.array;
        const velocities = systems.find((s) => s.type === 'dust')?.velocities;
        if (velocities) {
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            if (positions[i * 3] > 20) positions[i * 3] = -20;
            if (positions[i * 3] < -20) positions[i * 3] = 20;
            if (positions[i * 3 + 1] > 20) positions[i * 3 + 1] = -20;
          }
          dustField.geometry.attributes.position.needsUpdate = true;
        }
      }

      if (rainField) {
        const positions = rainField.geometry.attributes.position.array;
        const velocities = systems.find((s) => s.type === 'rain')?.velocities;
        if (velocities) {
          const speed = 1 + bass * 5;
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] -= velocities[i] * speed;
            if (positions[i * 3 + 1] < -15) positions[i * 3 + 1] = 15;
          }
          rainField.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [weather, forceTime]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />;
}
