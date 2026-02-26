import { useEffect, useState } from 'react';

function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const onMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setActive(true);
    };

    const onLeave = () => {
      setActive(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`cursor-glow ${active ? 'is-active' : ''}`}
      style={{
        transform: `translate3d(${position.x - 120}px, ${position.y - 120}px, 0)`
      }}
    />
  );
}

export default CursorGlow;
