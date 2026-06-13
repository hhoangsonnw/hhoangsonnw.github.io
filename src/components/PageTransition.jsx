import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '', id = 'main-content', ...props }) {
  return (
    <motion.main
      id={id}
      className={className}
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.main>
  );
}
