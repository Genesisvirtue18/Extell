import { useEffect, useRef } from 'react';

const HOVER_RIPPLE_RADIUS = 3;
const HOVER_RIPPLE_STRENGTH = 85;
const CLICK_RIPPLE_RADIUS = 9;
const CLICK_RIPPLE_STRENGTH = 220;
const DAMPING = 0.985;

function WaterBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const offscreenRef = useRef(null);
  const simRef = useRef({
    width: 0,
    height: 0,
    previous: null,
    current: null,
    imageData: null
  });
  const pointerRef = useRef({ x: 0, y: 0, active: false, lastStamp: 0 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const offscreen = document.createElement('canvas');
    offscreenRef.current = offscreen;
    const offscreenContext = offscreen.getContext('2d', { alpha: true });
    if (!offscreenContext) return undefined;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      const simWidth = Math.max(140, Math.floor(window.innerWidth / 5));
      const simHeight = Math.max(80, Math.floor(window.innerHeight / 5));
      simRef.current.width = simWidth;
      simRef.current.height = simHeight;
      simRef.current.previous = new Float32Array(simWidth * simHeight);
      simRef.current.current = new Float32Array(simWidth * simHeight);
      simRef.current.imageData = null;

      offscreen.width = simWidth;
      offscreen.height = simHeight;
    };

    const disturb = (clientX, clientY, radius, strength) => {
      const sim = simRef.current;
      if (!sim.current) return;

      const x = Math.floor((clientX / window.innerWidth) * sim.width);
      const y = Math.floor((clientY / window.innerHeight) * sim.height);
      const xStart = Math.max(1, x - radius);
      const xEnd = Math.min(sim.width - 2, x + radius);
      const yStart = Math.max(1, y - radius);
      const yEnd = Math.min(sim.height - 2, y + radius);

      for (let row = yStart; row <= yEnd; row += 1) {
        for (let col = xStart; col <= xEnd; col += 1) {
          const dx = col - x;
          const dy = row - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= radius) {
            const index = row * sim.width + col;
            const falloff = 1 - distance / radius;
            sim.current[index] += strength * falloff;
          }
        }
      }
    };

    const onPointerMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;

      const now = performance.now();
      if (now - pointerRef.current.lastStamp > 32) {
        disturb(event.clientX, event.clientY, HOVER_RIPPLE_RADIUS, HOVER_RIPPLE_STRENGTH);
        pointerRef.current.lastStamp = now;
      }
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onPointerClick = (event) => {
      disturb(event.clientX, event.clientY, CLICK_RIPPLE_RADIUS, CLICK_RIPPLE_STRENGTH);
    };

    const update = () => {
      const sim = simRef.current;
      if (!sim.current || !sim.previous) return;

      const { width, height } = sim;
      const next = sim.previous;
      const current = sim.current;

      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const i = y * width + x;
          next[i] = (((current[i - 1] + current[i + 1] + current[i - width] + current[i + width]) * 0.5) - next[i]) * DAMPING;
        }
      }

      sim.previous = current;
      sim.current = next;
    };

    const render = () => {
      const sim = simRef.current;
      if (!sim.current || !offscreenContext) return;

      if (!sim.imageData) {
        sim.imageData = offscreenContext.createImageData(sim.width, sim.height);
      }
      const pixels = sim.imageData.data;
      const values = sim.current;

      for (let i = 0; i < values.length; i += 1) {
        const value = values[i];
        const p = i * 4;
        const magnitude = Math.min(255, Math.abs(value) * 1.6);
        const red = Math.max(0, Math.min(255, 26 + magnitude * 0.55));
        const green = Math.max(0, Math.min(255, 78 + magnitude * 0.5));
        const blue = Math.max(0, Math.min(255, 128 + magnitude * 0.8));
        const alpha = Math.max(0, Math.min(105, magnitude * 0.55));

        pixels[p] = red;
        pixels[p + 1] = green;
        pixels[p + 2] = blue;
        pixels[p + 3] = alpha;
      }

      offscreenContext.putImageData(sim.imageData, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = 'screen';
      context.drawImage(offscreen, 0, 0, window.innerWidth, window.innerHeight);

      if (pointerRef.current.active) {
        const gradient = context.createRadialGradient(
          pointerRef.current.x,
          pointerRef.current.y,
          0,
          pointerRef.current.x,
          pointerRef.current.y,
          160
        );
        gradient.addColorStop(0, 'rgba(148, 212, 255, 0.12)');
        gradient.addColorStop(0.55, 'rgba(69, 157, 255, 0.07)');
        gradient.addColorStop(1, 'rgba(229, 57, 53, 0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(pointerRef.current.x, pointerRef.current.y, 160, 0, Math.PI * 2);
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';
    };

    const tick = () => {
      update();
      render();
      frameRef.current = requestAnimationFrame(tick);
    };

    resize();
    frameRef.current = requestAnimationFrame(tick);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('click', onPointerClick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('click', onPointerClick);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={`water-bg-layer ${className}`.trim()} aria-hidden>
      <canvas ref={canvasRef} className="water-ripple-canvas" />
    </div>
  );
}

export default WaterBackground;
