import React from 'react';
import { motion } from 'framer-motion';
import CozySpotlightCard from './CozySpotlightCard';

interface BentoGridProps {
  className?: string;
}

const features = [
  {
    id: 'ddd',
    title: 'DDD Tactical Patterns',
    description: 'First-class support for Aggregate, Entity, Value Object, Domain Event, and Repository patterns. Build rich domain models that evolve with your business.',
    icon: '🏗️',
    size: 'large',
    color: 'var(--brand-primary)',
  },
  {
    id: 'non-intrusive',
    title: 'Non-Intrusive',
    description: 'Plug & play into ASP.NET Core with minimal configuration. No forced inheritance or magic conventions.',
    icon: '🔌',
    size: 'medium',
    color: 'var(--brand-secondary)',
  },
  {
    id: 'modular',
    title: 'Modular Design',
    description: 'Use only what you need. Each feature is independently packaged so your app stays lean.',
    icon: '📦',
    size: 'medium',
    color: '#F97316',
  },
  {
    id: 'audit',
    title: 'Auto Audit',
    description: 'Automatic tracking of CreatedAt, ModifiedBy, and more. Soft delete support included.',
    icon: '📋',
    size: 'small',
    color: 'var(--brand-primary)',
  },
  {
    id: 'events',
    title: 'Domain Events',
    description: 'Decouple your domain logic with powerful event dispatching.',
    icon: '📡',
    size: 'small',
    color: 'var(--brand-secondary)',
  }
];

const BentoGrid: React.FC<BentoGridProps> = ({ className = '' }) => {
  return (
    <section className={`py-24 lg:py-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 text-sm font-mono font-medium 
              text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 
              rounded-full border border-[var(--brand-primary)]/20"
          >
            FEATURES
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Everything you need
          </h2>
          
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            A complete toolkit for building domain-driven .NET applications with confidence.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <CozySpotlightCard
              key={feature.id}
              className={`
                ${feature.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}
                ${feature.size === 'medium' ? 'lg:col-span-1' : ''}
              `}
            >
              <div className={`p-6 lg:p-8 h-full ${feature.size === 'large' ? 'min-h-[280px]' : 'min-h-[200px]'}`}>
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  style={{ 
                    backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                  }}
                >
                  {feature.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>

                {/* Visual accent for large card */}
                {feature.size === 'large' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-[var(--border-color)]"
                  >
                    <div className="flex flex-wrap gap-3">
                      {['Aggregate', 'Entity', 'Value Object', 'Repository', 'Domain Event'].map((pattern) => (
                        <span
                          key={pattern}
                          className="px-3 py-1.5 text-sm font-mono rounded-lg
                            bg-[var(--bg-main)] border border-[var(--border-color)]
                            text-[var(--text-secondary)]"
                        >
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </CozySpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
