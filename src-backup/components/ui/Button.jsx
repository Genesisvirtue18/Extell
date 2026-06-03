import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#ed2125] text-white shadow-[0_10px_28px_rgba(237,33,37,0.45)] hover:bg-[#d31c20] hover:shadow-[0_12px_30px_rgba(237,33,37,0.5)]',
    secondary: 'ui-surface-1 ui-text ui-hover-accent hover:border-cyan-300',
    ghost: 'ui-surface-1 ui-text ui-hover-surface hover:border-cyan-300'
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`ui-focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      <ArrowRight size={16} />
    </motion.button>
  );
}

export default Button;
