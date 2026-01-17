import React, { useEffect, useRef } from 'react';

interface GridBackgroundProps {
  className?: string;
  gridColor?: string;
  dotColor?: string;
  mouseReactive?: boolean;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  className = '',
  gridColor = 'rgba(0, 240, 255, 0.03)',
  dotColor = 'rgba(0, 240, 255, 0.15)',
  mouseReactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    if (mouseReactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const gridSize = 60;
    const dotRadius = 1.5;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw dots at intersections with mouse reactivity
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;

          let scale = 1;
          let alpha = 0.15;

          if (mouseReactive && distance < maxDistance) {
            const intensity = 1 - distance / maxDistance;
            scale = 1 + intensity * 2;
            alpha = 0.15 + intensity * 0.85;
          }

          ctx.beginPath();
          ctx.arc(x, y, dotRadius * scale, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace('0.15', alpha.toString());
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (mouseReactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gridColor, dotColor, mouseReactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`grid-background ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default GridBackground;
