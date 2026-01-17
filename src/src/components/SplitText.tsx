import React, { useRef, useEffect, useState, useMemo } from 'react';

interface TransformProps {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: TransformProps;
  to?: TransformProps;
  threshold?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onAnimationComplete?: () => void;
}

interface SplitElement {
  content: string;
  key: string;
  needsSpace: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 0.8,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  tag = 'p',
  textAlign = 'center',
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Split text into elements
  const elements: SplitElement[] = useMemo(() => {
    if (splitType === 'words') {
      return text.split(' ').map((word: string, index: number) => ({
        content: word,
        key: `word-${index}`,
        needsSpace: index < text.split(' ').length - 1
      }));
    } else if (splitType === 'lines') {
      return text.split('\n').map((line: string, index: number) => ({
        content: line,
        key: `line-${index}`,
        needsSpace: false
      }));
    } else {
      // chars
      return text.split('').map((char: string, index: number) => ({
        content: char === ' ' ? '\u00A0' : char,
        key: `char-${index}`,
        needsSpace: false
      }));
    }
  }, [text, splitType]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasAnimated]);

  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const totalDuration = delay * elements.length + duration * 1000;
      const timer = setTimeout(onAnimationComplete, totalDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, duration, elements.length, onAnimationComplete]);

  const getInitialStyle = (): React.CSSProperties => ({
    opacity: from.opacity ?? 0,
    transform: `translateY(${from.y ?? 40}px) translateX(${from.x ?? 0}px) scale(${from.scale ?? 1})`,
    display: 'inline-block',
  });

  const getAnimatedStyle = (index: number): React.CSSProperties => ({
    opacity: to.opacity ?? 1,
    transform: `translateY(${to.y ?? 0}px) translateX(${to.x ?? 0}px) scale(${to.scale ?? 1})`,
    display: 'inline-block',
    transition: `all ${duration}s cubic-bezier(0.33, 1, 0.68, 1) ${index * delay / 1000}s`,
  });

  const style: React.CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  };

  const content = elements.map((element: SplitElement, index: number) => (
    <span
      key={element.key}
      style={isVisible ? getAnimatedStyle(index) : getInitialStyle()}
    >
      {element.content}
      {element.needsSpace && <span>&nbsp;</span>}
    </span>
  ));

  const TagComponent = tag;

  return (
    <div ref={containerRef}>
      <TagComponent style={style} className={className}>
        {content}
      </TagComponent>
    </div>
  );
};

export default SplitText;
