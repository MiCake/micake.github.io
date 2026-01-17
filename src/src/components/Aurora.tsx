import React, { useEffect, useRef } from 'react';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  className?: string;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#3A29FF', '#FF94B4', '#FF6B6B', '#4ECDC4'],
  amplitude = 1.0,
  blend = 0.5,
  time = 0,
  speed = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(time);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
    };

    const colors = colorStops.map(hexToRgb);

    const draw = () => {
      timeRef.current += 0.01 * speed;
      const t = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

      colors.forEach((color, index) => {
        const offset = index / (colors.length - 1);
        const wave = Math.sin(t + offset * Math.PI * 2) * amplitude * 0.1;
        const adjustedOffset = Math.max(0, Math.min(1, offset + wave));
        gradient.addColorStop(adjustedOffset, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${blend})`);
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw aurora waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x += 10) {
          const y =
            canvas.height / 2 +
            Math.sin((x / canvas.width) * Math.PI * 4 + t * (i + 1)) * amplitude * 50 * (i + 1) +
            Math.cos((x / canvas.width) * Math.PI * 2 + t * 0.5) * amplitude * 30;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const color = colors[i % colors.length];
        const waveGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        waveGradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        waveGradient.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${blend * 0.3})`);
        waveGradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

        ctx.fillStyle = waveGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colorStops, amplitude, blend, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`aurora-background ${className}`}
    />
  );
};

export default Aurora;
