import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function FloatingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 right-5 z-40"
    >
      <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">
        <MessageCircle size={16} /> Talk to Sales
      </Link>
    </motion.div>
  );
}

export default FloatingCTA;