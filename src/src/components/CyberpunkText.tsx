import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CyberpunkTextProps {
  text: string;
  className?: string;
  speed?: number;
  glitchIntensity?: number;
  color?: string;
  glowColor?: string;
}

const CyberpunkText: React.FC<CyberpunkTextProps> = ({
  text,
  className = '',
  speed = 50,
  glitchIntensity = 0.1,
  color = '#00F0FF',
  glowColor = '#00F0FF'
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isDecrypting && !isComplete) {
            setIsDecrypting(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isDecrypting, isComplete]);

  useEffect(() => {
    if (!isDecrypting) return;

    let currentIndex = 0;
    let iterationsPerChar = 3;
    let currentIteration = 0;

    const interval = setInterval(() => {
      if (currentIndex >= text.length) {
        setDisplayText(text);
        setIsComplete(true);
        setIsDecrypting(false);
        clearInterval(interval);
        return;
      }

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < currentIndex) {
          result += text[i];
        } else if (i === currentIndex) {
          if (currentIteration < iterationsPerChar) {
            result += chars[Math.floor(Math.random() * chars.length)];
          } else {
            result += text[i];
            currentIndex++;
            currentIteration = 0;
          }
        } else {
          if (Math.random() < glitchIntensity) {
            result += chars[Math.floor(Math.random() * chars.length)];
          } else {
            result += text[i];
          }
        }
      }

      currentIteration++;
      setDisplayText(result);
    }, speed);

    return () => clearInterval(interval);
  }, [isDecrypting, text, speed, glitchIntensity]);

  return (
    <motion.span
      ref={containerRef}
      className={`cyberpunk-text ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        color,
        textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
        fontFamily: "'JetBrains Mono', monospace"
      }}
    >
      {displayText || text.split('').map(() => ' ').join('')}
    </motion.span>
  );
};

export default CyberpunkText;
