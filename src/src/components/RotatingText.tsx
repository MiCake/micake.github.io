import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  transition?: Transition;
  initial?: {
    y?: string | number;
    opacity?: number;
  };
  animate?: {
    y?: string | number;
    opacity?: number;
  };
  exit?: {
    y?: string | number;
    opacity?: number;
  };
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center';
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'characters' | 'words' | 'lines';
  className?: string;
  elementClassName?: string;
}

interface WordElement {
  characters: string[];
  needsSpace: boolean;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  transition = { type: 'spring', damping: 25, stiffness: 300 },
  initial = { y: '100%', opacity: 0 },
  animate = { y: 0, opacity: 1 },
  exit = { y: '-120%', opacity: 0 },
  rotationInterval = 2000,
  staggerDuration = 0.025,
  staggerFrom = 'first',
  loop = true,
  auto = true,
  splitBy = 'characters',
  className = '',
  elementClassName = ''
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), segment => segment.segment);
    }
    return Array.from(text);
  };

  const elements: WordElement[] = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word: string, i: number) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word: string, i: number, arr: string[]) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line: string, i: number, arr: string[]) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }
    return [];
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number): number => {
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      return index * staggerDuration;
    },
    [staggerDuration, staggerFrom]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = window.setInterval(() => {
      setCurrentTextIndex((prev: number) => (loop ? (prev + 1) % texts.length : Math.min(prev + 1, texts.length - 1)));
    }, rotationInterval);
    return () => window.clearInterval(intervalId);
  }, [auto, loop, rotationInterval, texts.length]);

  let globalCharIndex = 0;
  const totalChars = elements.reduce((sum: number, word: WordElement) => sum + word.characters.length, 0);

  return (
    <span className={`inline-flex flex-wrap whitespace-pre-wrap relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={currentTextIndex} className="inline-flex flex-wrap whitespace-pre-wrap">
          {elements.map((wordObj: WordElement, wordIndex: number) => (
            <span key={wordIndex} className="inline-flex whitespace-pre-wrap">
              {wordObj.characters.map((char: string, charIndex: number) => {
                const delay = getStaggerDelay(globalCharIndex++, totalChars);
                return (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay
                    }}
                    className={`inline-block ${elementClassName}`}
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordObj.needsSpace && <span>&nbsp;</span>}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
