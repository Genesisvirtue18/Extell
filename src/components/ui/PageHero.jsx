import { motion } from 'framer-motion';

function PageHero({ title, description, actions }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-hero-gradient">
      <div className="absolute inset-0 bg-tech-grid bg-[size:22px_22px] opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto max-w-7xl px-6 py-20 md:py-24"
      >
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">{description}</p>
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </motion.div>
    </section>
  );
}

export default PageHero;