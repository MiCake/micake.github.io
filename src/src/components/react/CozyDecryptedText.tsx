import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  className?: string;
  animateOn?: 'view' | 'hover' | 'both';
  onComplete?: () => void;
}

/**
 * DecryptedText - Characters scramble then resolve effect
 * Warm, playful version for "Cozy Engineering" theme
 */
const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 15,
  className = '',
  animateOn = 'view',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    let iteration = 0;
    let currentIndex = 0;
    
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < currentIndex) return text[idx];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );
      
      iteration++;
      
      if (iteration % 3 === 0 && currentIndex < text.length) {
        currentIndex++;
      }
      
      if (currentIndex >= text.length && iteration > maxIterations) {
        clearInterval(interval as any);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(interval as any);
  };

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') {
      setDisplayText(text);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [text, animateOn, hasAnimated]);

  const hoverProps = (animateOn === 'hover' || animateOn === 'both') ? {
    onMouseEnter: () => {
      if (!isAnimating) {
        setHasAnimated(false);
        startAnimation();
      }
    }
  } : {};

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...hoverProps}
    >
      {displayText || text.split('').map(() => '█').join('')}
    </motion.span>
  );
};

export default DecryptedText;
