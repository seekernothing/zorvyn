import type { Variants } from "framer-motion";

// framer needs a typed 4-tuple or it yells at you
export const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: EASE },
  },
};
