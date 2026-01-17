import React, { useEffect, useRef } from 'react';

interface CozyParticlesProps {
  particleCount?: number;
  className?: string;
}

/**
 * Cozy Particles - Warm floating particles effect
 * Light Mode: Subtle grey/orange dust
 * Dark Mode: Glowing warm amber sparks
 */
const CozyParticles: React.FC<CozyParticlesProps> = ({
  particleCount = 50,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
    pulse: number;
    pulseSpeed: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const getColors = () => {
      if (isDarkMode()) {
        return ['#FF9F1C', '#FFBF69', '#F97316', '#FCD34D', '#FB923C'];
      }
      return ['#A8A29E', '#D4D4D4', '#FFB366', '#E5E7EB', '#CBD5E1'];
    };

    const createParticles = () => {
      const colors = getColors();
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const dark = isDarkMode();

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.pulse += particle.pulseSpeed;

        // Mouse interaction - gentle attraction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.02;
          particle.speedX += dx * force * 0.01;
          particle.speedY += dy * force * 0.01;
        }

        // Damping
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Wrap around
        if (particle.x < -10) particle.x = canvas.offsetWidth + 10;
        if (particle.x > canvas.offsetWidth + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.offsetHeight + 10;
        if (particle.y > canvas.offsetHeight + 10) particle.y = -10;

        // Calculate pulse opacity
        const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        if (dark) {
          // Glowing effect for dark mode
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = pulseOpacity;
          ctx.fill();
          
          // Glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.globalAlpha = pulseOpacity * 0.3;
          ctx.fill();
        } else {
          // Subtle dust for light mode
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = pulseOpacity * 0.6;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const colors = getColors();
      particlesRef.current.forEach((particle) => {
        particle.color = colors[Math.floor(Math.random() * colors.length)];
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.8 }}
    />
  );
};

export default CozyParticles;
