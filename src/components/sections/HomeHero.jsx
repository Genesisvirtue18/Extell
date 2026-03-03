import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Activity, ShieldCheck, Zap } from 'lucide-react';
import WaterBackground from '../ui/WaterBackground';
import homeBackground from '../../assets/homebg.jpg';

function HomeHero() {
  return (
    <section
      className="relative overflow-hidden bg-transparent"
      style={{
        backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.72), rgba(2, 6, 23, 0.78)), url(${homeBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <WaterBackground className="water-bg-hero" />
      <div className="absolute inset-0 bg-tech-grid bg-[size:26px_26px] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      <div className="absolute -right-24 top-16 h-72 w-72 animate-spinSlow rounded-full border border-black/40" />
      <div className="absolute -left-10 bottom-10 h-52 w-52 animate-float rounded-full bg-black/40 blur-3xl" />
      <div className="absolute right-[12%] top-20 h-40 w-[2px] animate-pulseLine bg-gradient-to-b from-accent/10 via-accent to-accent/0" />
      <div className="absolute bottom-14 left-[18%] h-[2px] w-52 animate-pulseLine bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"
      >
        <p className="accent-chip text-xs font-semibold uppercase tracking-[0.24em]">Enterprise Infrastructure</p>
        <h1 className="headline-glow mt-4 max-w-3xl text-xl font-extrabold leading-tight md:text-4xl">
          <span className="text-[#ed2125]">Power Electronics</span>{' '}
          <span className="accent-title">and ICT Network Solutions</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-neutral-200 md:text-lg">
          Global distribution across <span className="font-semibold text-[#ed2125]">20+</span> countries
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="bg-none !bg-[#ed2125] hover:!bg-[#d91f23] text-white shadow-[0_10px_28px_rgba(237,33,37,0.45)] hover:shadow-[0_12px_30px_rgba(237,33,37,0.5)]">
            Explore Products
          </Button>
          <Button variant="secondary" className="border-accent/25">Contact Sales</Button>
          <Button variant="ghost">Download Catalog</Button>
        </div>
        <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          <div className="tech-panel red-wash rounded-lg p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-100"><Activity size={14} className="text-[#ed2125]" /> Live Uptime Focus</p>
          </div>
          <div className="tech-panel red-wash rounded-lg p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-100"><ShieldCheck size={14} className="text-accent" /> Compliance Ready</p>
          </div>
          <div className="tech-panel red-wash rounded-lg p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-100"><Zap size={14} className="text-[#ed2125]" /> Critical Power</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HomeHero;
