import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../theme/ThemeContext';
import { Fallback3DHero } from './Fallback3DHero';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isWebGLSupported = useWebGLSupport();
  const { enable3D, reducedMotion, activeTheme } = useTheme();

  useEffect(() => {
    if (!enable3D || reducedMotion || !isWebGLSupported || !mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. Central Holographic Torus (Percentile Ring)
    const ringGeo = new THREE.TorusGeometry(1.3, 0.14, 24, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: activeTheme === 'dark' ? 0x10b981 : 0x059669,
      emissive: activeTheme === 'dark' ? 0x064e3b : 0x047857,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    scene.add(mainRing);

    // 4. Secondary Orbital Lattice Ring (Golden Orbit)
    const latticeGeo = new THREE.TorusGeometry(1.65, 0.04, 16, 60);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: activeTheme === 'dark' ? 0xf59e0b : 0xd97706,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const latticeRing = new THREE.Mesh(latticeGeo, latticeMat);
    scene.add(latticeRing);

    // 5. Orbiting Data Nodes (Gold & Mint Crystals)
    const nodeGeo = new THREE.IcosahedronGeometry(0.12, 1);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      roughness: 0.1,
      metalness: 0.9
    });
    const node1 = new THREE.Mesh(nodeGeo, nodeMat);
    const node2 = new THREE.Mesh(nodeGeo, nodeMat);
    scene.add(node1);
    scene.add(node2);

    // 6. Particle Constellation
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 4;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: activeTheme === 'dark' ? 0x6ec2fd : 0x389df2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x6ec2fd, 2.5, 10);
    blueLight.position.set(2, 2, 3);
    scene.add(blueLight);

    const mintLight = new THREE.PointLight(0xbeffcc, 1.8, 10);
    mintLight.position.set(-2, -2, 2);
    scene.add(mintLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainRing.rotation.x = 0.5 + mouseY + Math.sin(elapsedTime * 0.5) * 0.15;
      mainRing.rotation.y = elapsedTime * 0.35 + mouseX;
      mainRing.rotation.z = Math.cos(elapsedTime * 0.4) * 0.1;

      latticeRing.rotation.x = -mouseY + Math.cos(elapsedTime * 0.6) * 0.2;
      latticeRing.rotation.y = -elapsedTime * 0.25 - mouseX;

      // Orbit nodes
      const angle1 = elapsedTime * 1.2;
      node1.position.set(Math.cos(angle1) * 1.65, Math.sin(angle1) * 1.65, Math.sin(angle1 * 2) * 0.4);

      const angle2 = elapsedTime * 1.2 + Math.PI;
      node2.position.set(Math.cos(angle2) * 1.65, Math.sin(angle2) * 1.65, Math.sin(angle2 * 2) * 0.4);

      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.08) * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [enable3D, reducedMotion, isWebGLSupported, activeTheme]);

  if (!enable3D || reducedMotion || !isWebGLSupported) {
    return <Fallback3DHero />;
  }

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
