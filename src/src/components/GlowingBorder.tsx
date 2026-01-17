import React from 'react';
import { motion } from 'framer-motion';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderWidth?: number;
  animationDuration?: number;
}

const GlowingBorder: React.FC<GlowingBorderProps> = ({
  children,
  className = '',
  glowColor = '#00F0FF',
  borderWidth = 1,
  animationDuration = 3
}) => {
  return (
    <div className={`glowing-border-wrapper ${className}`}>
      <div 
        className="glowing-border-container"
        style={{
          position: 'relative',
          borderRadius: '12px',
          padding: borderWidth
        }}
      >
        {/* Animated gradient border */}
        <motion.div
          className="glowing-border-gradient"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12px',
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent, ${glowColor}, transparent)`,
            backgroundSize: '200% 100%',
            opacity: 0.8
          }}
        />
        
        {/* Inner content */}
        <div
          style={{
            position: 'relative',
            background: '#0A0A0A',
            borderRadius: '11px',
            zIndex: 1
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlowingBorder;
