import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: Props) {
  const variants = {
    up: { y: 16, opacity: 0, filter: 'blur(4px)' },
    left: { x: 20, opacity: 0, filter: 'blur(4px)' },
    right: { x: -20, opacity: 0, filter: 'blur(4px)' },
    none: { opacity: 0, filter: 'blur(4px)' },
  };

  return (
    <motion.div
      initial={variants[direction]}
      whileInView={{ y: 0, x: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
