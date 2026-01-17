import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  code: string;
  language: string;
}

interface CodeTabsProps {
  tabs: Tab[];
  className?: string;
}

const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const highlightCode = (code: string): React.ReactNode => {
    // Simple syntax highlighting
    const lines = code.split('\n');
    return lines.map((line, i) => {
      let highlighted = line
        // Keywords
        .replace(/\b(public|private|class|interface|void|var|async|await|return|new|using|namespace|static|readonly|override|virtual|abstract|sealed|partial|get|set|if|else|for|foreach|while|do|switch|case|break|continue|try|catch|finally|throw|typeof|is|as|null|true|false|this|base)\b/g, '<span class="code-keyword">$1</span>')
        // Types
        .replace(/\b(string|int|bool|double|float|long|object|dynamic|Task|IEnumerable|List|Dictionary|Action|Func|Entity|AggregateRoot|ValueObject|Repository|IRepository)\b/g, '<span class="code-type">$1</span>')
        // Strings
        .replace(/(".*?")/g, '<span class="code-string">$1</span>')
        // Comments
        .replace(/(\/\/.*)$/g, '<span class="code-comment">$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
        // Decorators/Attributes
        .replace(/(\[.*?\])/g, '<span class="code-decorator">$1</span>')
        // Methods
        .replace(/\.([A-Za-z]+)\(/g, '.<span class="code-method">$1</span>(');

      return (
        <div key={i} className="code-line">
          <span className="line-number">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
        </div>
      );
    });
  };

  return (
    <div className={`code-tabs-container ${className}`}>
      {/* Vertical Tabs */}
      <div className="code-tabs-sidebar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`code-tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="tab-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div className="code-editor-pane">
        <div className="code-editor-header">
          <div className="editor-dots">
            <span className="dot close"></span>
            <span className="dot minimize"></span>
            <span className="dot maximize"></span>
          </div>
          <span className="editor-filename">{activeTabData?.label}.cs</span>
        </div>
        <div className="code-editor-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="code-content"
            >
              {activeTabData && highlightCode(activeTabData.code)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CodeTabs;
