'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { QuoteIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SceneHeading } from '@/components/ui/SceneHeading';

interface MessageSceneProps {
  message: string;
  messageIndex: number;
  onNext: () => void;
}

const MESSAGE_TITLES = [
  'One thing to remember…',
  'A tiny happy thought…',
  'A little appreciation…',
  'A wish for you…',
];

const GLOWS = [
  'radial-gradient(circle at 18% 20%, rgba(244,163,189,0.45), transparent 55%)',
  'radial-gradient(circle at 82% 18%, rgba(245,194,107,0.35), transparent 55%)',
  'radial-gradient(circle at 50% 90%, rgba(224,82,126,0.28), transparent 60%)',
  'radial-gradient(circle at 12% 80%, rgba(182,156,240,0.35), transparent 55%)',
];

export function MessageScene({ message, messageIndex, onNext }: MessageSceneProps) {
  const reduce = useReducedMotion();
  const words = message.trim().split(/\s+/).filter(Boolean);

  return (
    <div style={{ position: 'relative' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -20,
          background: GLOWS[messageIndex % GLOWS.length],
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />
      <Eyebrow>A LITTLE NOTE FOR YOU · 0{messageIndex + 1}/04</Eyebrow>
      <div className="quote-mark">
        <QuoteIcon size={42} />
      </div>
      <SceneHeading>{MESSAGE_TITLES[messageIndex]}</SceneHeading>
      <blockquote className="message" style={{ position: 'relative' }}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.12, ease: EASE_OUT }}
            style={{ display: 'inline-block', marginRight: '0.35em' }}
          >
            {word}
          </motion.span>
        ))}
      </blockquote>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
        style={{
          height: 1,
          width: 'min(180px, 50%)',
          margin: '0 auto',
          transformOrigin: 'center',
          background: 'linear-gradient(90deg, transparent, #e0527e, #f5c26b, transparent)',
        }}
      />
      <div className="dots" aria-label={`Note ${messageIndex + 1} of 4`}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} className={i === messageIndex ? 'active' : ''} />
        ))}
      </div>
      <Button data-testid="continue" onClick={onNext} nudge guide>
        Next little note
      </Button>
    </div>
  );
}
