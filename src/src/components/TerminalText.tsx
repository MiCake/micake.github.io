import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalTextProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  cursorChar?: string;
  className?: string;
  prompt?: string;
  onComplete?: () => void;
}

const TerminalText: React.FC<TerminalTextProps> = ({
  lines,
  typingSpeed = 50,
  lineDelay = 500,
  cursorChar = '▋',
  className = '',
  prompt = '$ ',
  onComplete
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setIsInView(true);
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!isInView) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    if (currentLine >= lines.length) {
      onComplete?.();
      return;
    }

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length <= currentLine) {
            newLines.push(line.slice(0, currentChar + 1));
          } else {
            newLines[currentLine] = line.slice(0, currentChar + 1);
          }
          return newLines;
        });
        setCurrentChar((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, lineDelay);

      return () => clearTimeout(timeout);
    }
  }, [isInView, currentLine, currentChar, lines, typingSpeed, lineDelay, onComplete]);

  return (
    <div ref={containerRef} className={`terminal-text ${className}`}>
      {displayedLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-line"
        >
          <span className="terminal-prompt">{prompt}</span>
          <span className="terminal-content">{line}</span>
          {index === currentLine && (
            <span className={`terminal-cursor ${showCursor ? 'visible' : 'hidden'}`}>
              {cursorChar}
            </span>
          )}
        </motion.div>
      ))}
      {currentLine < lines.length && displayedLines.length <= currentLine && (
        <div className="terminal-line">
          <span className="terminal-prompt">{prompt}</span>
          <span className={`terminal-cursor ${showCursor ? 'visible' : 'hidden'}`}>
            {cursorChar}
          </span>
        </div>
      )}
    </div>
  );
};

export default TerminalText;
