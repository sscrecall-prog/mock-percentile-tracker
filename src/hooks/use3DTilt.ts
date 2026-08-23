import { useRef, useState, useCallback, MouseEvent, useEffect } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
  isHovered: boolean;
}

export function use3DTilt(maxTilt: number = 8, perspective: number = 1000) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    isHovered: false
  });

  useEffect(() => {
    // Check if device is touch-based (no fine hover pointer)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsTouchDevice(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !ref.current) return;
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
  }, [maxTilt, isTouchDevice]);

  const onMouseEnter = useCallback(() => {
    if (!isTouchDevice) {
      setTilt(prev => ({ ...prev, isHovered: true }));
    }
  }, [isTouchDevice]);

  const onMouseLeave = useCallback(() => {
    if (!isTouchDevice) {
      setTilt({
        rotateX: 0,
        rotateY: 0,
        glowX: 50,
        glowY: 50,
        isHovered: false
      });
    }
  }, [isTouchDevice]);

  const transformStyle = isTouchDevice ? undefined : {
    transform: tilt.isHovered 
      ? `perspective(${perspective}px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
      : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  };

  const glowStyle = isTouchDevice ? undefined : {
    background: tilt.isHovered 
      ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(16, 185, 129, 0.15), transparent 70%)`
      : 'transparent',
    transition: 'background 0.2s ease-out'
  };

  return { ref, transformStyle, glowStyle, onMouseMove, onMouseEnter, onMouseLeave, isHovered: tilt.isHovered };
}
