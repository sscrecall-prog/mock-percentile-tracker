import React from 'react';
import { use3DTilt } from '../../hooks/use3DTilt';
import { useTheme } from '../../theme/ThemeContext';

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  onClick?: () => void;
}

export const Card3DTilt: React.FC<Card3DTiltProps> = ({
  children,
  className = '',
  maxTilt = 6,
  perspective = 1000,
  onClick
}) => {
  const { enable3D, reducedMotion } = useTheme();
  const { ref, transformStyle, glowStyle, onMouseMove, onMouseEnter, onMouseLeave } = use3DTilt(
    enable3D && !reducedMotion ? maxTilt : 0,
    perspective
  );

  return (
    <div
      ref={ref}
      style={enable3D && !reducedMotion ? transformStyle : undefined}
      onMouseMove={enable3D && !reducedMotion ? onMouseMove : undefined}
      onMouseEnter={enable3D && !reducedMotion ? onMouseEnter : undefined}
      onMouseLeave={enable3D && !reducedMotion ? onMouseLeave : undefined}
      onClick={onClick}
      className={`relative rounded-2xl transition-all duration-300 transform-gpu ${className}`}
    >
      {/* Light Reflection Glare Layer */}
      {enable3D && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-10"
          style={glowStyle}
        />
      )}
      {children}
    </div>
  );
};
