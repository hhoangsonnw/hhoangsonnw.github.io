import { useEffect, useRef } from 'react';

// /impeccable animate + colorize: background motion becomes a restrained signal map using the vault palette.
const particleColors = ['rgba(47, 138, 104, 0.52)', 'rgba(213, 162, 83, 0.38)', 'rgba(169, 75, 88, 0.32)'];

export default function ParticleNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: null, y: null };
    let animationId;
    let particles = [];

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(72, Math.max(28, Math.floor((width * height) / 34000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        radius: Math.random() * 1.45 + 0.65,
        color: particleColors[index % particleColors.length],
      }));
      draw();
    }

    function draw() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        if (!prefersReducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 130) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(47, 138, 104, ${0.14 * (1 - distance / 130)})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }

        if (pointer.x !== null) {
          const distanceToPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
          if (distanceToPointer < 180) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            context.strokeStyle = `rgba(213, 162, 83, ${0.18 * (1 - distanceToPointer / 180)})`;
            context.stroke();
          }
        }
      });

      if (!prefersReducedMotion) {
        animationId = window.requestAnimationFrame(draw);
      }
    }

    function handlePointerMove(event) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }

    function handlePointerLeave() {
      pointer.x = null;
      pointer.y = null;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-45 dark:opacity-55" aria-hidden="true" />;
}
