import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-electric to-blue-500 text-white shadow-[0_10px_28px_rgba(31,123,255,0.45)] hover:shadow-[0_12px_30px_rgba(229,57,53,0.35)]',
    secondary: 'bg-white text-navy hover:bg-blue-50 border border-white/20',
    ghost: 'border border-white/35 hover:border-accent/70 hover:text-red-100 text-white'
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={16} />
    </motion.button>
  );
}

export default Button;
