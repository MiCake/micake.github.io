import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  activeScale?: number;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  magnetStrength = 0.3,
  activeScale = 1.1,
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    setPosition({
      x: distanceX * magnetStrength,
      y: distanceY * magnetStrength
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnet-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovered ? activeScale : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.5
      }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
