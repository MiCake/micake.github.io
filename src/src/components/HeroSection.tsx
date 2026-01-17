import React from 'react';
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import Particles from './Particles';

interface HeroSectionProps {
  title?: string;
  tagline?: string;
  rotatingTexts?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = '欢迎使用 MiCake',
  tagline = '专为 .NET 开发者打造的轻量级 DDD 工具包',
  rotatingTexts = ['简单', '规范', '高效']
}) => {
  return (
    <div className="hero-section-wrapper">
      {/* Background Particles */}
      <div className="hero-particles-bg">
        <Particles
          particleCount={150}
          particleSpread={15}
          speed={0.08}
          particleColors={['#ffd700', '#ff9800', '#ffc107', '#ffeb3b']}
          moveParticlesOnHover={true}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={0.8}
          cameraDistance={25}
        />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-title-wrapper">
          <SplitText
            text={title}
            tag="h1"
            className="hero-animated-title"
            delay={60}
            duration={0.7}
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.9 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            textAlign="center"
          />
        </div>

        <div className="hero-tagline-wrapper">
          <span className="hero-tagline-prefix">🚀 让领域驱动设计变得 </span>
          <RotatingText
            texts={rotatingTexts}
            className="hero-rotating-text"
            rotationInterval={2500}
            staggerDuration={0.03}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          />
        </div>

        <p className="hero-description">
          {tagline}
        </p>
      </div>

      <style>{`
        .hero-section-wrapper {
          position: relative;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }

        .hero-particles-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          opacity: 0.6;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
        }

        .hero-title-wrapper {
          margin-bottom: 1.5rem;
        }

        .hero-animated-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, var(--sl-color-accent, #ffd700) 0%, #ff9800 50%, var(--sl-color-accent, #ffd700) 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.4));
          animation: gradient-shift 3s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-tagline-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .hero-tagline-prefix {
          color: var(--sl-color-white, #fff);
        }

        [data-theme="light"] .hero-tagline-prefix {
          color: var(--sl-color-gray-6, #374151);
        }

        .hero-rotating-text {
          color: var(--sl-color-accent, #ffd700);
          font-weight: 700;
          min-width: 80px;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--sl-color-gray-2, #9ca3af);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        [data-theme="light"] .hero-description {
          color: var(--sl-color-gray-5, #4b5563);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
