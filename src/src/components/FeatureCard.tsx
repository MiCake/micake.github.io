import React from 'react';
import AnimatedCard from './AnimatedCard';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0
}) => {
  return (
    <AnimatedCard
      className="feature-card-animated"
      glowColor="var(--micake-yellow-glow, rgba(255, 215, 0, 0.4))"
    >
      <div className="feature-card-inner" style={{ animationDelay: `${delay}ms` }}>
        <div className="feature-icon">{icon}</div>
        <div className="feature-content">
          <h3 className="feature-title">{title}</h3>
          <p className="feature-description" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>

      <style>{`
        .feature-card-animated {
          background: rgba(30, 30, 40, 0.6);
          border: 1px solid var(--sl-color-gray-5, #374151);
          border-radius: 16px;
          transition: border-color 0.3s ease;
          height: 100%;
        }

        [data-theme="light"] .feature-card-animated {
          background: #ffffff;
          border-color: var(--sl-color-gray-2, #e5e7eb);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .feature-card-animated:hover {
          border-color: var(--micake-yellow, #ffd700);
        }

        .feature-card-inner {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-icon {
          font-size: 3rem;
          background: rgba(255, 215, 0, 0.1);
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
        }

        [data-theme="light"] .feature-icon {
          background: rgba(245, 127, 23, 0.1);
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--micake-yellow, #ffd700);
          margin: 0;
        }

        [data-theme="light"] .feature-title {
          color: var(--sl-color-accent, #f57f17);
        }

        .feature-description {
          color: var(--sl-color-gray-2, #9ca3af);
          line-height: 1.6;
          margin: 0;
        }

        [data-theme="light"] .feature-description {
          color: #4b5563;
        }

        .feature-description strong {
          color: var(--sl-color-white, #fff);
        }

        [data-theme="light"] .feature-description strong {
          color: var(--sl-color-black, #1f2937);
        }
      `}</style>
    </AnimatedCard>
  );
};

export default FeatureCard;
