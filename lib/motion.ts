export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_INOUT = [0.4, 0, 0.2, 1] as const;
export const DUR = {
  micro: 0.25,
  reveal: 0.8,
  ambient: 2.5,
} as const;
export const STAGGER = 0.09;
export const SPRING_SOFT = { type: 'spring', stiffness: 140, damping: 16 } as const;
export const SPRING_SNAPPY = { type: 'spring', stiffness: 320, damping: 22 } as const;
