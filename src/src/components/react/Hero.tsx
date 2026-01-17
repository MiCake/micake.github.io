import React from "react";
import { motion } from "framer-motion";
import CozyDecryptedText from "./CozyDecryptedText";
import Magnetic from "./Magnetic";
import CozyParticles from "./CozyParticles";
import ShinyText from "../ShinyText";

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className = "" }) => {
  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden ${className}`}
    >
      {/* Background Particles */}
      <CozyParticles particleCount={60} />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--brand-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--brand-secondary)]/5 rounded-full blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full
                bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
              <ShinyText
                text="v10.0 Now Available"
                className="text-sm font-medium text-[var(--brand-primary)]"
                speed={3}
                color='var(--brand-primary)'
              />
            </motion.div>

            {/* Headline with Decrypted Effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block text-[var(--text-primary)]"
              >
                Baked for
              </motion.span>
              <span className="block mt-2">
                <CozyDecryptedText
                  text=".NET Experience"
                  speed={35}
                  maxIterations={20}
                  className="text-[var(--brand-primary)] font-bold"
                  animateOn="view"
                />
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              A lightweight Domain-Driven Design toolkit for .NET. Ship faster
              with battle-tested 
              <span className="pl-1 text-[var(--brand-primary)]">DDD patterns</span>,
              auto-audit, and modular architecture.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Magnetic strength={0.2}>
                <a
                  href="/getting-started/quick-start/"
                  className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4 rounded-xl font-semibold text-base
                    bg-[var(--brand-primary)] text-[#12100E]
                    hover:bg-[var(--brand-secondary)] transition-all duration-200
                    shadow-lg shadow-[var(--brand-primary)]/25
                    hover:shadow-xl hover:shadow-[var(--brand-primary)]/30
                  "
                >
                  <span>🚀</span>
                  Get Started
                </a>
              </Magnetic>

              <Magnetic strength={0.2}>
                <a
                  href="https://github.com/MiCake/MiCake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2
                    px-8 py-4 rounded-xl font-semibold text-base
                    border border-[var(--border-color)]
                    text-[var(--text-primary)]
                    hover:border-[var(--brand-primary)]/50
                    hover:bg-[var(--brand-primary)]/5
                    transition-all duration-200
                  "
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Star on GitHub
                </a>
              </Magnetic>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-[var(--border-color)]"
            >
              {[
                { value: "10K+", label: "Downloads" },
                { value: "100%", label: "Open Source" },
                { value: ".NET 10", label: "Ready" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-[var(--brand-primary)] font-mono">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <Magnetic strength={0.15}>
              <div className="relative">
                {/* Glow Ring */}
                <div className="absolute inset-0 animate-pulse-glow rounded-full" />

                {/* Main Logo Container */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 
                    flex items-center justify-center
                    bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-secondary)]/10
                    rounded-full border border-[var(--brand-primary)]/20"
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)]/30 to-transparent blur-xl" />

                  {/* Logo Image */}
                  <img
                    src="/logo.png"
                    alt="MiCake Logo"
                    className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-contain select-none filter drop-shadow-lg"
                  />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                      key={angle}
                      className="absolute w-3 h-3 rounded-full bg-[var(--brand-primary)]"
                      style={{
                        left: `${50 + 55 * Math.cos((angle * Math.PI) / 180)}%`,
                        top: `${50 + 55 * Math.sin((angle * Math.PI) / 180)}%`,
                        opacity: 0.3 + i * 0.1,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3 + i * 0.1, 0.6, 0.3 + i * 0.1],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
        >
          <span className="text-sm">Scroll to explore</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
