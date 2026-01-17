import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  delay?: number;
  stepDuration?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  animateBy = 'words',
  direction = 'top',
  delay = 200,
  stepDuration = 0.35,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
          }
        });
      },
      { threshold, rootMargin }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin, isInView]);

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const handleAnimationComplete = (index: number) => {
    if (index === elements.length - 1 && !animationComplete) {
      setAnimationComplete(true);
      onAnimationComplete?.();
    }
  };

  const yOffset = direction === 'top' ? -20 : 20;

  return (
    <span ref={containerRef} className={`blur-text-container ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: yOffset, filter: 'blur(10px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: yOffset, filter: 'blur(10px)' }
          }
          transition={{
            duration: stepDuration,
            delay: (delay / 1000) * index,
            ease: 'easeOut'
          }}
          onAnimationComplete={() => handleAnimationComplete(index)}
          className="blur-text-element"
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
