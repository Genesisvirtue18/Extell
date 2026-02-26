import { motion } from 'framer-motion';
import loaderImage from '../../assets/loader.png';

function AppLoader() {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#070d2f]/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <motion.img
          src={loaderImage}
          alt="Loading"
          className="h-20 w-20 object-contain"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, ease: 'linear', repeat: Infinity }}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">Loading Experience</p>
      </div>
    </div>
  );
}

export default AppLoader;
