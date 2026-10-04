'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { formatName } from '@/lib/formatName';
import { useTimeouts } from '@/lib/hooks';
import { AnimatedName } from './AnimatedName';
import { ConstellationCanvas, ConstellationCanvasRef } from './ConstellationCanvas';
import { Petals } from './Petals';
import { useBloomAudio } from './AudioProvider';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

interface FinalSceneProps {
  recipientName: string;
  onReplay: () => void;
}

export function FinalScene({ recipientName, onReplay }: FinalSceneProps) {
  const isReducedMotion = useReducedMotion();
  const { later, clearAll } = useTimeouts();
  const audio = useBloomAudio();
  const canvasRef = useRef<ConstellationCanvasRef>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startedRef = useRef(false);
  const [phase, setPhase] = useState(0);
  const [showPetals, setShowPetals] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const formattedName = formatName(recipientName);
  const message = 'May this year bring you everything you wish for and more. You are celebrated, you are loved, and you are wonderful.';
  const messageLines = message.split('. ').filter(Boolean);

  const killMotion = () => {
    timelineRef.current?.kill();
    timelineRef.current = null;
    if (canvasRef.current) {
      gsap.killTweensOf(canvasRef.current.starsRef.current);
      gsap.killTweensOf(canvasRef.current.lineProgressRef.current);
      gsap.killTweensOf(canvasRef.current.pulseRef.current);
    }
    confetti.reset();
  };

  const triggerFireworks = () => {
    const origins = [
      { x: 0.2, y: 0.35 },
      { x: 0.8, y: 0.35 },
      { x: 0.5, y: 0.25 },
    ];
    const colors = ['#f5c26b', '#e0527e', '#ffffff'];

    origins.forEach((origin, i) => {
      later(() => {
        confetti({
          particleCount: 28,
          spread: 70,
          startVelocity: 30,
          scalar: 1.2,
          gravity: 0.7,
          ticks: 200,
          colors,
          shapes: ['circle', 'star'],
          zIndex: 120,
          origin,
          disableForReducedMotion: true,
        });

        try {
          const heartPath = 'M167 72c19-38-37-56-75-28-22 17-28 55 3 82 25 21 56 38 72 74 14-36 47-53 72-74 31-27 25-65 3-82-38-28-94-10-75 28z';
          const shape = confetti.shapeFromPath({ path: heartPath });
          confetti({
            particleCount: 16,
            spread: 50,
            startVelocity: 25,
            scalar: 0.6,
            gravity: 0.7,
            ticks: 150,
            colors: ['#f4a3bd', '#e0527e'],
            shapes: [shape],
            zIndex: 120,
            origin,
            disableForReducedMotion: true,
          });
        } catch {
          // Optional heart shapes; circles/stars already fired.
        }
      }, i * 500);
    });
  };

  const triggerRandomFirework = () => {
    const origin = {
      x: 0.14 + Math.random() * 0.72,
      y: 0.12 + Math.random() * 0.42,
    };
    const colors = [
      ['#ffffff', '#ffd166', '#ff6b8f'],
      ['#f5c26b', '#e0527e', '#ffffff'],
      ['#ff9db2', '#ffffff', '#b98cff'],
    ][Math.floor(Math.random() * 3)];

    confetti({
      particleCount: 42,
      spread: 96,
      startVelocity: 34,
      decay: 0.91,
      gravity: 0.55,
      scalar: 0.9,
      ticks: 220,
      colors,
      shapes: ['circle', 'star'],
      zIndex: 4,
      origin,
      disableForReducedMotion: true,
    });
  };

  const startTimeline = () => {
    const api = canvasRef.current;
    if (!api || timelineRef.current) return;

    api.recomputeTargets();
    const stars = api.starsRef.current;
    if (!stars.length) return;

    const heartStars = stars.filter(s => s.isHeart);
    const bgStars = stars.filter(s => !s.isHeart);
    const lines = api.lineProgressRef.current;
    const pulse = api.pulseRef.current;
    pulse.value = 1;
    lines.forEach(seg => {
      seg.p = 0;
    });

    const probe = stars[0];
    console.log('Star 0 before travel:', { x: probe.x, y: probe.y, tx: probe.tx, ty: probe.ty });

    const tl = gsap.timeline({ paused: false });
    timelineRef.current = tl;

    tl.addLabel('stars', 0.8);
    tl.addLabel('travel', 3.0);
    tl.addLabel('lines', 5.2);
    tl.addLabel('pulse', 5.8);
    tl.addLabel('name', 6.6);
    tl.addLabel('title', 7.6);
    tl.addLabel('message', 8.4);
    tl.addLabel('fireworks', 9.0);
    tl.addLabel('replay', 10.5);

    tl.call(() => setPhase(0), undefined, 0);
    tl.call(() => setPhase(1), undefined, 'stars');

    tl.to(heartStars, {
      x: (i: number) => heartStars[i].tx,
      y: (i: number) => heartStars[i].ty,
      duration: 2.2,
      ease: 'power3.inOut',
      stagger: 0.015,
    }, 'travel');

    tl.to(bgStars, {
      x: (i: number) => bgStars[i].tx,
      y: (i: number) => bgStars[i].ty,
      alpha: 0.15,
      duration: 2.2,
      ease: 'power1.inOut',
    }, 'travel');

    tl.call(() => setPhase(2), undefined, 'travel');

    tl.to(lines, {
      p: 1,
      duration: 1.2,
      stagger: 0.02,
      ease: 'power2.inOut',
    }, 'lines');

    tl.to(pulse, {
      value: 1.06,
      duration: 0.4,
      ease: 'power2.out',
    }, 'pulse');
    tl.to(pulse, {
      value: 1,
      duration: 0.4,
      ease: 'power2.in',
    }, 'pulse+=0.4');
    tl.call(() => {
      audio.play('swell');
      setShowPetals(true);
    }, undefined, 'pulse');

    tl.call(() => {
      console.log('Star 0 after travel:', { x: stars[0].x, y: stars[0].y, tx: stars[0].tx, ty: stars[0].ty });
      setPhase(3);
    }, undefined, 'name');
    tl.call(() => setPhase(4), undefined, 'title');
    tl.call(() => setPhase(5), undefined, 'message');
    tl.call(() => {
      setPhase(6);
      triggerFireworks();
    }, undefined, 'fireworks');
    tl.call(() => setPhase(7), undefined, 'replay');
  };

  const handleSkip = () => {
    if (skipped || isReducedMotion || phase >= 7) return;
    setSkipped(true);
    setShowSkipHint(false);
    timelineRef.current?.seek('replay');
    setPhase(7);
    setShowPetals(true);
    triggerFireworks();
  };

  const handleReplay = () => {
    killMotion();
    setPhase(0);
    setShowPetals(false);
    setShowSkipHint(false);
    setSkipped(false);
    later(() => onReplay(), 600);
  };

  useEffect(() => {
    if (isReducedMotion) {
      setPhase(7);
      return;
    }
    setShowSkipHint(true);
    const hintTimer = setTimeout(() => setShowSkipHint(false), 5000);
    const replayFallback = setTimeout(() => {
      setPhase(prev => Math.max(prev, 7));
      triggerFireworks();
    }, 12500);
    return () => {
      clearTimeout(hintTimer);
      clearTimeout(replayFallback);
    };
  }, [isReducedMotion]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!timelineRef.current) return;
      if (document.hidden) timelineRef.current.pause();
      else timelineRef.current.resume();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    return () => {
      killMotion();
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- teardown only
  }, []);

  useEffect(() => {
    if (isReducedMotion || phase < 6) return;

    let active = true;
    const schedule = () => {
      later(() => {
        if (!active) return;
        triggerRandomFirework();
        schedule();
      }, 900 + Math.random() * 1200);
    };

    schedule();
    return () => {
      active = false;
    };
  }, [phase, isReducedMotion]);

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, #3a0f26 0%, #14040d 100%)',
        cursor: phase < 3 ? 'pointer' : 'default',
        zIndex: 8,
      }}
    >
      <ConstellationCanvas
        ref={canvasRef}
        onReady={() => {
          if (!startedRef.current && !isReducedMotion) {
            startedRef.current = true;
            startTimeline();
          }
        }}
      />

      <Petals visible={showPetals} />

      {showSkipHint && phase < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#fff1f5',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          Tap to skip
        </motion.div>
      )}

      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            style={{
              position: 'absolute',
              width: 'min(70vw, 360px, 40vh)',
              height: 'min(70vw, 360px, 40vh)',
              background: 'radial-gradient(circle, rgba(224, 82, 126, 0.7) 0%, transparent 70%)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="final-name-heart"
            style={{ textAlign: 'center', zIndex: 10 }}
          >
            <div className="final-heart-symbols" aria-hidden>
              {Array.from({ length: 42 }, (_, i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}>❤</span>
              ))}
            </div>
            <AnimatedName
              name={recipientName}
              size="clamp(32px, 8vw, 56px)"
              delay={0}
              loop={true}
              outline
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 4 && (
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(26px, 6vw, 40px)',
              color: '#fff1f5',
              marginTop: '24px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            Happy Birthday, {formattedName}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5c26b" style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: '32px', textAlign: 'center', maxWidth: '90%', zIndex: 10 }}
          >
            {messageLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 'clamp(14px, 3.5vw, 18px)',
                  color: '#fff1f5',
                  lineHeight: 1.6,
                  margin: '8px 0',
                }}
              >
                {line}{line.endsWith('.') ? '' : '.'}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase >= 7 && (
          <motion.button
            className="primary"
            data-testid="replay"
            onClick={(e) => {
              e.stopPropagation();
              handleReplay();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff1f5',
              zIndex: 10,
            }}
          >
            Replay the journey
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
