'use client';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

interface ChapterOverlayProps {
  chapterTransition: string | null;
}

export function ChapterOverlay({ chapterTransition }: ChapterOverlayProps) {
  if (!chapterTransition) return null;

  const [rawNumber, title] = chapterTransition.split(':');
  const kicker = (rawNumber || 'CHAPTER').trim().toUpperCase();

  return (
    <motion.div
      className="chapter-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <motion.div className="chapter-glow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <div className="chapter-content" style={{ position: 'relative', textAlign: 'center', padding: 24 }}>
        <motion.div
          className="chapter-kicker"
          initial={{ opacity: 0, letterSpacing: '0.7em' }}
          animate={{ opacity: 0.75, letterSpacing: '0.42em' }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {kicker}
        </motion.div>
        <motion.div
          className="chapter-title"
          initial={{ opacity: 0, y: 18, letterSpacing: '0.12em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.02em' }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
        >
          {(title || '').trim()}
        </motion.div>
        <motion.div
          className="chapter-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.45, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}
