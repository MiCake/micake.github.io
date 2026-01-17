import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: (value: number) => string;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className = '',
  formatter,
  separator = ',',
  decimals = 0,
  prefix = '',
  suffix = ''
}) => {
  const count = useMotionValue(from);
  const [displayValue, setDisplayValue] = useState(from);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const formatNumber = (num: number): string => {
    if (formatter) return formatter(num);
    
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return `${prefix}${parts.join('.')}${suffix}`;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const controls = animate(count, to, {
              duration,
              delay,
              ease: 'easeOut',
              onUpdate: (latest) => {
                setDisplayValue(latest);
              }
            });

            return () => controls.stop();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [count, to, duration, delay, hasAnimated]);

  return (
    <motion.span ref={containerRef} className={`count-up ${className}`}>
      {formatNumber(displayValue)}
    </motion.span>
  );
};

export default CountUp;
