'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe, ShieldCheck, Zap, Server } from 'lucide-react';
import WaterBackground from '../ui/WaterBackground';

const homeBackground = '/assets/homebg.jpg';

const stats = [
  { value: '20+', label: 'Countries' },
  { value: '500+', label: 'Projects' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '15+', label: 'Years' },
];

function HomeHero() {
  const router = useRouter();

  return (
    <section
      className="home-hero relative overflow-hidden"
      style={{
        backgroundImage: `url(${homeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Always-dark overlay — not affected by site theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(5,5,10,0.93) 0%, rgba(8,6,10,0.88) 55%, rgba(12,4,5,0.91) 100%)',
        }}
      />
      <WaterBackground className="water-bg-hero" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Accent glow — bottom left */}
      <div
        className="absolute -left-20 bottom-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'rgba(237,33,37,0.10)' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            style={{
              border: '1px solid rgba(237,33,37,0.4)',
              background: 'rgba(237,33,37,0.08)',
              color: '#ffb3b3',
            }}
          >
            Enterprise Infrastructure
          </span>

          {/* Headline */}
          <h1
            className="mt-4 font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.85rem, 5vw, 3.6rem)', color: '#ffffff' }}
          >
            Powering the World&apos;s{' '}
            <span style={{ color: '#ed2125' }}>Critical</span>
            {' '}Infrastructure
          </h1>

          {/* Sub-heading */}
          <p
            className="mt-4 max-w-lg text-sm leading-relaxed sm:text-base"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            Enterprise UPS systems, fiber cables, and ICT infrastructure deployed
            across <span className="font-medium text-white">20+ countries</span> for
            mission-critical operations.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.97]"
              style={{
                background: '#ed2125',
                boxShadow: '0 4px 20px rgba(237,33,37,0.35)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#d91f23')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ed2125')}
            >
              Explore Products
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() => router.push('/contact')}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.97]"
              style={{
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.05)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            >
              Contact Sales
            </button>
          </div>

          {/* Stats strip */}
          <div
            className="mt-10 grid grid-cols-2 gap-3 border-t sm:grid-cols-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-white sm:text-2xl">{value}</p>
                <p
                  className="mt-0.5 text-[0.7rem] font-medium uppercase tracking-[0.1em]"
                  style={{ color: 'rgba(255,255,255,0.38)' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: ShieldCheck, text: 'ISO Certified' },
              { icon: Globe, text: 'Global Distribution' },
             
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 text-[0.7rem] font-medium"
                style={{ color: 'rgba(255,255,255,0.32)' }}
              >
                <Icon size={11} style={{ color: '#ed2125' }} />
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeHero;
