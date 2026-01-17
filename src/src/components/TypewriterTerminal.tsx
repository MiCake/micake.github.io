import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTerminalProps {
  commands: string[];
  typingSpeed?: number;
  lineDelay?: number;
  className?: string;
  prompt?: string;
}

const TypewriterTerminal: React.FC<TypewriterTerminalProps> = ({
  commands,
  typingSpeed = 50,
  lineDelay = 800,
  className = '',
  prompt = '❯'
}) => {
  const [displayedLines, setDisplayedLines] = useState<Array<{ text: string; isComplete: boolean }>>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    if (currentLineIndex >= commands.length) return;

    const currentCommand = commands[currentLineIndex];

    if (currentCharIndex < currentCommand.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push({ text: currentCommand.slice(0, currentCharIndex + 1), isComplete: false });
          } else {
            newLines[currentLineIndex] = { text: currentCommand.slice(0, currentCharIndex + 1), isComplete: false };
          }
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          if (newLines[currentLineIndex]) {
            newLines[currentLineIndex].isComplete = true;
          }
          return newLines;
        });
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }
  }, [isInView, currentLineIndex, currentCharIndex, commands, typingSpeed, lineDelay]);

  return (
    <div ref={containerRef} className={`typewriter-terminal ${className}`}>
      <div className="terminal-3d-wrapper">
        <div className="terminal-3d-container">
          {/* Terminal Header */}
          <div className="terminal-header-3d">
            <div className="terminal-dots-3d">
              <span className="dot-3d close"></span>
              <span className="dot-3d minimize"></span>
              <span className="dot-3d maximize"></span>
            </div>
            <span className="terminal-title-3d">terminal — zsh</span>
            <div className="terminal-header-right"></div>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body-3d">
            {displayedLines.map((line, index) => (
              <div key={index} className="terminal-line-3d">
                <span className="terminal-prompt-3d">{prompt}</span>
                <span className="terminal-command-3d">
                  {line.text}
                  {index === currentLineIndex && !line.isComplete && (
                    <span className={`terminal-cursor-3d ${showCursor ? 'visible' : ''}`}>▋</span>
                  )}
                </span>
                {line.isComplete && line.text.startsWith('npm') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="terminal-output-3d"
                  >
                    <span className="output-success">✓</span> Done in 0.8s
                  </motion.div>
                )}
              </div>
            ))}
            {currentLineIndex < commands.length && displayedLines.length <= currentLineIndex && (
              <div className="terminal-line-3d">
                <span className="terminal-prompt-3d">{prompt}</span>
                <span className={`terminal-cursor-3d ${showCursor ? 'visible' : ''}`}>▋</span>
              </div>
            )}
            {currentLineIndex >= commands.length && (
              <div className="terminal-line-3d">
                <span className="terminal-prompt-3d">{prompt}</span>
                <span className={`terminal-cursor-3d ${showCursor ? 'visible' : ''}`}>▋</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypewriterTerminal;
