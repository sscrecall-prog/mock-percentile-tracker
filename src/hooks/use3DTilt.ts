import { useRef, useState, useCallback, MouseEvent } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
  isHovered: boolean;
}

export function use3DTilt(maxTilt: number = 8, perspective: number = 1000) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    isHovered: false
  });

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const percentX = (x / width) * 100;
    const percentY = (y / height) * 100;

    // Calculate rotation: center is 0
    const rotX = -((y - height / 2) / (height / 2)) * maxTilt;
    const rotY = ((x - width / 2) / (width / 2)) * maxTilt;

    setTilt({
      rotateX: rotX,
      rotateY: rotY,
      glowX: percentX,
      glowY: percentY,
      isHovered: true
    });
  }, [maxTilt]);

  const onMouseEnter = useCallback(() => {
    setTilt(prev => ({ ...prev, isHovered: true }));
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      isHovered: false
    });
  }, []);

  const transformStyle = {
    transform: tilt.isHovered 
      ? `perspective(${perspective}px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };

  const glowStyle = {
    background: tilt.isHovered 
      ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(110, 194, 253, 0.12), transparent 70%)`
      : 'transparent',
    transition: 'background 0.2s ease-out'
  };

  return { ref, transformStyle, glowStyle, onMouseMove, onMouseEnter, onMouseLeave, isHovered: tilt.isHovered };
}
