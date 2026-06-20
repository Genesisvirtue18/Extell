'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe, ShieldCheck, Zap, Server, Cpu } from 'lucide-react';
import WaterBackground from '../ui/WaterBackground';

const homeBackground = '/assets/homebg.jpg';

const stats = [
  { value: '20+', label: 'Countries Served', icon: Globe },
  { value: '500+', label: 'Enterprise Projects', icon: Server },
  { value: '99.9%', label: 'Uptime Guarantee', icon: ShieldCheck },
  { value: '15+', label: 'Years of Expertise', icon: Cpu },
];

const trust = [
  'ISO Certified Products',
  'Global Distribution',
  '2-Hour Response SLA',
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

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
      <WaterBackground className="water-bg-hero" />
      <div className="absolute inset-0 bg-tech-grid bg-[size:26px_26px] opacity-[0.07]" />
      <div className="ui-hero-overlay-strong absolute inset-0" />

      {/* Decorative geometry */}
      <div className="ui-orb-border absolute -right-32 top-8 h-[480px] w-[480px] animate-spinSlow rounded-full border opacity-40" />
      <div className="ui-orb absolute -left-16 bottom-0 h-80 w-80 animate-float rounded-full blur-3xl opacity-60" />
      <div className="absolute right-[12%] top-24 h-48 w-[2px] animate-pulseLine bg-gradient-to-b from-accent/10 via-accent to-accent/0" />
      <div className="absolute bottom-20 left-[18%] h-[2px] w-64 animate-pulseLine bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-36">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-center"
        >
          {/* ── Left column ── */}
          <div>
            <motion.p variants={fadeUp} className="accent-chip inline-flex text-xs font-bold uppercase tracking-[0.16em]">
              Enterprise Infrastructure
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-6 font-black leading-[1.06] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.75rem)' }}
            >
              Powering the World's
              <br />
              <span className="text-[#ed2125]">Critical</span> Infrastructure
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed ui-text-muted md:text-lg">
              Enterprise UPS systems, fiber cables, and ICT infrastructure —
              designed for mission-critical environments and deployed across{' '}
              <span className="font-semibold text-white">20+ countries</span>.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#ed2125] px-7 text-sm font-bold tracking-wide text-white shadow-[0_8px_28px_rgba(237,33,37,0.4)] transition hover:bg-[#d91f23] hover:shadow-[0_12px_36px_rgba(237,33,37,0.5)] active:scale-[0.98]"
              >
                Explore Products
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push('/contact')}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 text-sm font-bold tracking-wide text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
              >
                Request a Quote
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {trust.map((item) => (
                <span key={item} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/50">
                  <span className="h-1 w-1 rounded-full bg-[#ed2125]" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — stat cards ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="tech-panel red-wash ui-surface-1 flex flex-col rounded-2xl p-5"
              >
                <Icon size={18} className="text-[#ed2125]" />
                <p className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">{value}</p>
                <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/50">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Bottom trust strip ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.65 }}
          className="mt-16 border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Critical Power', desc: 'Modular & online double-conversion UPS for zero downtime' },
              { icon: Globe, title: 'Global Supply', desc: 'Direct distribution with logistics partners across 5 continents' },
              { icon: ShieldCheck, title: 'Compliance Ready', desc: 'CE, RoHS, and ISO certified products for regulated environments' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="tech-panel red-wash ui-surface-1 rounded-xl px-4 py-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-white">
                  <Icon size={13} className="text-[#ed2125]" />
                  {title}
                </p>
                <p className="mt-2 hidden text-xs leading-relaxed text-white/45 sm:block">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeHero;
