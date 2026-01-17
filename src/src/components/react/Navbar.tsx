import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial theme from data-theme attribute or class
    const dataTheme = document.documentElement.getAttribute('data-theme');
    const classTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const currentTheme = dataTheme || classTheme;
    setTheme(currentTheme as 'dark' | 'light');
    
    // Listen for theme changes from Starlight or other sources
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 
                      (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      setTheme(newTheme as 'dark' | 'light');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update both class and data-theme attribute
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update both localStorage keys for compatibility with Starlight
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('starlight-theme', newTheme);
    
    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }));
  };

  const navLinks = [
    { label: 'Docs', href: '/getting-started/introduction/' },
    { label: 'API', href: '/domain-driven/entity/' },
    { label: 'Utilities', href: '/utilities/overview/' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${className}`}
    >
      {/* Glassmorphism Capsule */}
      <div
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-full
          backdrop-blur-xl transition-all duration-300
          ${isScrolled 
            ? 'bg-[var(--bg-surface)]/90 shadow-lg shadow-black/10' 
            : 'bg-[var(--bg-surface)]/70'
          }
          border border-[var(--border-color)]
        `}
      >
        {/* Logo */}
        <a 
          href="/" 
          className="flex items-center gap-2 pr-4 border-r border-[var(--border-color)]"
        >
          <span className="text-2xl">🍰</span>
          <span className="font-semibold text-[var(--text-primary)] hidden sm:inline">
            MiCake
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                px-3 py-1.5 rounded-lg text-sm font-medium
                text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                hover:bg-[var(--brand-primary)]/10
                transition-colors duration-200
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-4" />

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="
            relative w-10 h-10 rounded-xl
            bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)]/20
            flex items-center justify-center
            transition-colors duration-200
          "
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.svg
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-[var(--brand-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-[var(--brand-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>

        {/* GitHub Link */}
        <a
          href="https://github.com/MiCake/MiCake"
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-10 h-10 rounded-xl
            flex items-center justify-center
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-hover)]
            transition-colors duration-200
          "
          aria-label="GitHub"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center
            text-[var(--text-secondary)] hover:text-[var(--text-primary)]
            hover:bg-[var(--bg-surface-hover)] transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label="Menu"
        >
          <motion.svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </motion.svg>
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              md:hidden absolute top-full left-0 right-0 mt-2
              bg-[var(--bg-surface)]/95 backdrop-blur-xl
              border border-[var(--border-color)] rounded-2xl
              p-2 shadow-xl
            "
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  block px-4 py-3 rounded-xl text-sm font-medium
                  text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                  hover:bg-[var(--brand-primary)]/10
                  transition-colors duration-200
                "
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
