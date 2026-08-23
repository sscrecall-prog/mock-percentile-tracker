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

    // 3. Central Holographic Torus (Electric Cyan / Cyber Purple Ring)
    const ringGeo = new THREE.TorusGeometry(1.3, 0.14, 24, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: activeTheme === 'dark' ? 0x00d2ff : 0x0088ff,
      emissive: activeTheme === 'dark' ? 0x003366 : 0x004488,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    scene.add(mainRing);

    // 4. Secondary Orbital Lattice Ring (Cyber Purple Orbit)
    const latticeGeo = new THREE.TorusGeometry(1.65, 0.04, 16, 60);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: activeTheme === 'dark' ? 0x8b5cf6 : 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const latticeRing = new THREE.Mesh(latticeGeo, latticeMat);
    scene.add(latticeRing);

    // 5. Orbiting Data Nodes (Vivid Magenta & Amber Crystals)
    const nodeGeo = new THREE.IcosahedronGeometry(0.12, 1);
    const nodeMat1 = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0x831843,
      roughness: 0.1,
      metalness: 0.9
    });
    const nodeMat2 = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x0369a1,
      roughness: 0.1,
      metalness: 0.9
    });
    const node1 = new THREE.Mesh(nodeGeo, nodeMat1);
    const node2 = new THREE.Mesh(nodeGeo, nodeMat2);
    scene.add(node1);
    scene.add(node2);

    // 6. Particle Constellation (Cyan & Magenta Stardust)
    const particleCount = 130;
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
      color: activeTheme === 'dark' ? 0x00d2ff : 0x2563eb,
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

    // Mouse Interaction (Desktop Fine Pointer Only)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktopPointer) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    if (isDesktopPointer) {
      window.addEventListener('mousemove', handleMouseMove);
    }

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

      // Smooth mouse interpolation on desktop
      if (isDesktopPointer) {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;
      }

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
      if (isDesktopPointer) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
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
