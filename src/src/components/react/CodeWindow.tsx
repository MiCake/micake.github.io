import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeWindowProps {
  className?: string;
}

const tabs = [
  {
    id: 'terminal',
    label: 'Terminal',
    icon: '⚡',
    language: 'bash',
    code: `❯ dotnet new install MiCake.Templates
  Creating project...
❯ dotnet new micake-webapi -n YourProjectName
❯ cd YourProjectName
❯ dotnet run
  
  Building...
  🍰 MiCake initialized!
  Now listening on: https://localhost:port
  [Done] MiCake app is ready! ✨`,
  },
];

// Warm Gruvbox-inspired syntax colors for dark mode
const darkSyntaxColors = {
  keyword: '#FB923C',      // Orange
  type: '#FCD34D',         // Yellow
  string: '#A3E635',       // Lime green
  comment: '#78716C',      // Muted gray
  method: '#60A5FA',       // Blue
  variable: '#FEFEFE',     // White
  number: '#F472B6',       // Pink
  operator: '#A8A29E',     // Gray
  prompt: '#FF9F1C',       // Brand orange
  success: '#4ADE80',      // Green
};

// Syntax colors for light mode
const lightSyntaxColors = {
  keyword: '#EA580C',      // Dark orange
  type: '#D97706',         // Dark yellow/amber
  string: '#65A30D',       // Dark lime green
  comment: '#78716C',      // Muted gray
  method: '#2563EB',       // Dark blue
  variable: '#1F2937',     // Dark gray (almost black)
  number: '#DB2777',       // Dark pink
  operator: '#6B7280',     // Medium gray
  prompt: '#EA580C',       // Dark orange
  success: '#16A34A',      // Dark green
};

const highlightCode = (code: string, language: string, colors: typeof darkSyntaxColors) => {
  if (language === 'bash') {
    return code.split('\n').map((line, i) => {
      if (line.startsWith('❯')) {
        const [prompt, ...rest] = line.split(' ');
        const command = rest.join(' ');
        return (
          <div key={i} className="code-line">
            <span style={{ color: colors.prompt }}>{prompt}</span>
            <span style={{ color: colors.variable }}> {command}</span>
          </div>
        );
      }
      if (line.includes('[Done]') || line.includes('✨') || line.includes('🍰')) {
        return (
          <div key={i} className="code-line" style={{ color: colors.success }}>
            {line}
          </div>
        );
      }
      return (
        <div key={i} className="code-line" style={{ color: colors.comment }}>
          {line}
        </div>
      );
    });
  }

  // C# highlighting
  const keywords = ['using', 'var', 'new', 'class', 'public', 'private', 'void', 'return', 'namespace', 'interface'];
  const types = ['WebApplication', 'IServiceCollection', 'MyAppModule', 'string', 'int', 'bool'];
  
  return code.split('\n').map((line, i) => {
    if (line.trim().startsWith('//')) {
      return (
        <div key={i} className="code-line" style={{ color: colors.comment }}>
          {line}
        </div>
      );
    }

    const tokens = line.split(/(\s+|[.();,<>])/g);
    
    return (
      <div key={i} className="code-line">
        {tokens.map((token, j) => {
          if (keywords.includes(token)) {
            return <span key={j} style={{ color: colors.keyword }}>{token}</span>;
          }
          if (types.includes(token) || token.endsWith('Builder') || token.endsWith('Module')) {
            return <span key={j} style={{ color: colors.type }}>{token}</span>;
          }
          if (token.startsWith('"') || token.startsWith("'")) {
            return <span key={j} style={{ color: colors.string }}>{token}</span>;
          }
          if (token === 'AddMiCake' || token === 'StartMiCake' || token === 'MapControllers' || token === 'Run' || token === 'Build' || token === 'CreateBuilder') {
            return <span key={j} style={{ color: colors.method }}>{token}</span>;
          }
          if (['(', ')', '.', ';', '<', '>', ','].includes(token)) {
            return <span key={j} style={{ color: colors.operator }}>{token}</span>;
          }
          return <span key={j} style={{ color: colors.variable }}>{token}</span>;
        })}
      </div>
    );
  });
};

const CodeWindow: React.FC<CodeWindowProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('program');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // 检测初始主题
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme !== 'light');
    };
    
    checkTheme();
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const syntaxColors = isDark ? darkSyntaxColors : lightSyntaxColors;

  return (
    <section className={`py-24 lg:py-32 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-mono font-medium 
              text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 
              rounded-full border border-[var(--brand-primary)]/20"
          >
            CODE EXPERIENCE
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Simple. Clean. Elegant.
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Launch your project instantly with a robust template.
          </p>
        </motion.div>

        {/* Code Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Window Chrome */}
          <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-2xl shadow-black/20">
            {/* Title Bar */}
            <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
              </div>

              {/* Tabs */}
              <div className="flex-1 flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-[var(--bg-main)] text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => navigator.clipboard.writeText(currentTab.code)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-main)] transition-colors"
                aria-label="Copy code"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Code Content */}
            <div className="bg-[var(--bg-main)] p-6 overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-sm leading-relaxed"
                >
                  <code>
                    {highlightCode(currentTab.code, currentTab.language, syntaxColors)}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-secondary)]/10 rounded-3xl blur-3xl opacity-50" />
        </motion.div>
      </div>
    </section>
  );
};

export default CodeWindow;
