/** Shared Framer Motion constants — import these instead of copy-pasting. */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const VIEWPORT = { once: true, margin: '-80px' } as const;

/** Standard stagger variants for card grids. */
export const staggerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.1 },
  }),
};

/** Slide-in from left for list items. */
export const slideLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE, delay: i * 0.1 },
  }),
};
