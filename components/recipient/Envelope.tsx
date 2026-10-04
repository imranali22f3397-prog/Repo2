'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';
import { useBloomAudio } from './AudioProvider';

interface EnvelopeProps {
  onOpenStart?: () => void;
  onOpened?: () => void;
}

export function Envelope({ onOpenStart, onOpened }: EnvelopeProps) {
  const { later } = useTimeouts();
  const audio = useBloomAudio();
  const [busy, setBusy] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapRotate, setFlapRotate] = useState(0);
  const [flapZ, setFlapZ] = useState(4);
  const [paperY, setPaperY] = useState(0);
  const [dropped, setDropped] = useState(false);

  const handleOpen = () => {
    if (busy) return;
    setBusy(true);
    audio.play('rustle');
    onOpenStart?.();
    setSealGone(true);

    later(() => setFlapRotate(-90), 300);
    later(() => {
      setFlapZ(0);
      setFlapRotate(-180);
    }, 650);
    later(() => setPaperY(-110), 1000);
    later(() => {
      setDropped(true);
      onOpened?.();
    }, 1900);
  };

  return (
    <motion.div
      animate={dropped ? { y: 40, opacity: 0.25 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="real-envelope-wrap"
    >
      {/* 60% of envelope height (aspect 3/2 ⇒ 40% of width) so the open flap is not clipped */}
      <div aria-hidden style={{ paddingTop: '40%' }} />

      <div
        className="real-envelope"
      >
        {/* z-1 back panel */}
        <div
          className="real-envelope-back"
        />

        {/* z2 small paper — sits under the pocket so it emerges from inside */}
        <motion.div
          style={{
            position: 'absolute',
            left: '6%',
            top: '8%',
            width: '88%',
            height: '70%',
            zIndex: 2,
            background: 'linear-gradient(180deg, #fffdf7, #f5eadf)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(74, 30, 43, 0.22)',
          }}
          animate={{ y: paperY, rotate: paperY < 0 ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '8%',
                right: '8%',
                top: `${15 + i * 18}%`,
                height: '1px',
                background: 'rgba(167, 28, 69, 0.15)',
              }}
            />
          ))}
        </motion.div>

        {/* z3 front pocket */}
        <div
          className="real-envelope-pocket"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '58%',
              borderRight: '1px solid rgba(167, 28, 69, 0.1)',
              transform: 'skewY(-25deg)',
              transformOrigin: 'top left',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '50%',
              height: '58%',
              borderLeft: '1px solid rgba(167, 28, 69, 0.1)',
              transform: 'skewY(25deg)',
              transformOrigin: 'top right',
            }}
          />
        </div>

        {/* flap: z4 while closed, z0 after passing -90 so it sits behind the paper */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '58%',
            zIndex: flapZ,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
          animate={{ rotateX: flapRotate }}
          transition={{
            duration: 0.35,
            ease: flapRotate === -90 ? [0.55, 0, 1, 1] : [0, 0, 0.2, 1],
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'linear-gradient(145deg, #fff1f5 0%, #edbdcb 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              borderRadius: '12px 12px 0 0',
              boxShadow: 'inset 0 8px 18px rgba(255,255,255,0.62)',
            }}
          >
            <motion.div
              className="real-envelope-seal"
              animate={sealGone ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="27" height="27" viewBox="0 0 24 24" fill="#ff2f2f">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #e8c4d4 0%, #ddb8c8 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              borderRadius: '6px 6px 0 0',
              transform: 'rotateX(180deg)',
            }}
          />
        </motion.div>

        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '10%',
            right: '10%',
            height: '12px',
            zIndex: -1,
            background: 'radial-gradient(ellipse, rgba(224, 82, 126, 0.15) 0%, transparent 70%)',
            filter: 'blur(4px)',
            borderRadius: '50%',
          }}
        />

        {!busy && (
          <motion.button
            onClick={handleOpen}
            aria-label="Open the envelope"
            data-testid="envelope-open"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
            whileHover={{ y: -4 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </div>
    </motion.div>
  );
}
