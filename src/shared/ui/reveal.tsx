'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // Задержка появления (для каскада в списках).
  delay?: number;
  // Сдвиг по вертикали на старте.
  y?: number;
  className?: string;
}

// Появление с лёгким подъёмом (React Bits / Motion). Точечная анимация для
// героя, секций и карточек. Анимируется ПРИ МОНТИРОВАНИИ (а не whileInView):
// так контент гарантированно оказывается видимым — даже ниже первого экрана он
// не «застрянет» невидимым, если observer не сработал. Уважает
// prefers-reduced-motion: при reduce появляется без движения.
export const Reveal = ({ children, delay = 0, y = 14, className }: Props) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
};
