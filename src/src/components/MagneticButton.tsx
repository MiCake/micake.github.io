import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  magnetStrength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  magnetStrength = 0.4
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * magnetStrength;
    const distanceY = (e.clientY - centerY) * magnetStrength;

    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary: 'magnetic-btn-primary',
    secondary: 'magnetic-btn-secondary',
    ghost: 'magnetic-btn-ghost'
  };

  const Component = href ? motion.a : motion.button;
  const componentProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined } : { onClick };

  return (
    <Component
      ref={buttonRef as any}
      {...componentProps}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.5
      }}
      className={`magnetic-button ${variantStyles[variant]} ${className}`}
    >
      <span className="magnetic-btn-content">{children}</span>
      <span className="magnetic-btn-glow"></span>
    </Component>
  );
};

export default MagneticButton;
