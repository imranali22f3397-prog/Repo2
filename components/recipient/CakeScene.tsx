'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { EASE_INOUT, EASE_OUT, SPRING_SNAPPY } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';
import { SparkleIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import styles from './CakeScene.module.css';

const CANDLE_COUNT = 4;

interface CakeSceneProps {
  candlesExtinguished: number[];
  onExtinguishCandle: (index: number) => void;
  onNext: () => void;
}

export function CakeScene({ candlesExtinguished, onExtinguishCandle, onNext }: CakeSceneProps) {
  const { later, clearAll } = useTimeouts();
  const isReducedMotion = useReducedMotion();
  const cakeRef = useRef<HTMLDivElement>(null);
  const [cakeEntered, setCakeEntered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [celebrationTriggered, setCelebrationTriggered] = useState(false);
  const allCandlesOut = candlesExtinguished.length === CANDLE_COUNT;
  const remaining = CANDLE_COUNT - candlesExtinguished.length;

  useEffect(() => {
    later(() => setCakeEntered(true), 250);
    later(() => setShowHint(true), 1450);
    return () => {
      clearAll();
      confetti.reset();
    };
  }, []);

  useEffect(() => {
    if (!allCandlesOut || celebrationTriggered) return;

    setCelebrationTriggered(true);

    if (!isReducedMotion && cakeRef.current) {
      const rect = cakeRef.current.getBoundingClientRect();
      confetti({
        particleCount: 130,
        spread: 88,
        startVelocity: 40,
        scalar: 0.88,
        colors: ['#f45b8d', '#ffd166', '#ffffff', '#9ad9ff', '#b98cff'],
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height * 0.36) / window.innerHeight,
        },
        zIndex: 100,
        disableForReducedMotion: true,
      });
    }
  }, [allCandlesOut, celebrationTriggered, isReducedMotion]);

  const handleCandleTap = (index: number) => {
    if (candlesExtinguished.includes(index) || allCandlesOut) return;
    onExtinguishCandle(index);
  };

  return (
    <div className={styles.scene} ref={cakeRef}>
      <motion.div
        className={`${styles.stage} ${allCandlesOut ? styles.celebrating : ''}`}
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: EASE_OUT }}
      >
        <motion.div
          className={styles.glow}
          animate={{ opacity: allCandlesOut ? [0.34, 0.72, 0.42] : [0.12, 0.24, 0.12] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: EASE_INOUT }}
        />

        <motion.div
          className={styles.cake}
          initial={{ opacity: 0, x: '-50%', y: 46, scale: 0.86 }}
          animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease: EASE_OUT }}
        >
          <div className={styles.candleRow} aria-label="Birthday candles">
            {Array.from({ length: CANDLE_COUNT }, (_, index) => {
              const out = candlesExtinguished.includes(index);

              return (
                <motion.button
                  key={index}
                  type="button"
                  data-testid={`candle-${index}`}
                  aria-label={`Blow out candle ${index + 1}`}
                  className={`${styles.candleButton} ${out ? styles.out : ''}`}
                  onClick={() => handleCandleTap(index)}
                  initial={{ opacity: 0, y: 18, scale: 0.76 }}
                  animate={{ opacity: cakeEntered ? 1 : 0, y: cakeEntered ? 0 : 18, scale: cakeEntered ? 1 : 0.76 }}
                  transition={{ delay: 0.68 + index * 0.12, duration: 0.4, ...SPRING_SNAPPY }}
                  whileHover={out || allCandlesOut ? undefined : { y: -4 }}
                  whileTap={out || allCandlesOut ? undefined : { scale: 0.96 }}
                >
                  <span className={styles.wick} />
                  {!out && (
                    <>
                      <motion.span
                        className={styles.flameGlow}
                        animate={isReducedMotion ? {} : { opacity: [0.32, 0.82, 0.38], scale: [0.88, 1.18, 0.92] }}
                        transition={{ duration: 1.2 + index * 0.12, repeat: Infinity, ease: EASE_INOUT }}
                      />
                      <motion.span
                        className={styles.flame}
                        animate={
                          isReducedMotion
                            ? {}
                            : {
                                scaleX: [1, 0.84, 1.08, 0.94, 1],
                                scaleY: [1, 1.18, 0.92, 1.1, 1],
                                rotate: [-2, 3, -4, 2, -2],
                              }
                        }
                        transition={{ duration: 0.65 + index * 0.08, repeat: Infinity, ease: EASE_INOUT }}
                      />
                    </>
                  )}
                  {out && (
                    <>
                      <span className={styles.ember} />
                      {!isReducedMotion && (
                        <span className={styles.smokeWrap}>
                          <motion.span
                            className={styles.smoke}
                            initial={{ opacity: 0.75, y: 0, x: 0, scale: 0.7 }}
                            animate={{ opacity: 0, y: -58, x: -13, scale: 1.25 }}
                            transition={{ duration: 1.35, ease: EASE_OUT }}
                          />
                          <motion.span
                            className={styles.smoke}
                            initial={{ opacity: 0.65, y: 0, x: 0, scale: 0.6 }}
                            animate={{ opacity: 0, y: -68, x: 12, scale: 1.35 }}
                            transition={{ duration: 1.55, delay: 0.12, ease: EASE_OUT }}
                          />
                        </span>
                      )}
                    </>
                  )}
                  <span className={styles.candleBody}>
                    <span />
                    <span />
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className={styles.cakeTop}>
            <span className={styles.creamRing} />
            <span className={styles.creamDollop} />
            <span className={styles.creamDollop} />
            <span className={styles.creamDollop} />
            <span className={styles.creamDollop} />
            <span className={styles.flower} />
            <span className={styles.flower} />
            <span className={styles.flower} />
            <span className={styles.sprinkle} />
            <span className={styles.sprinkle} />
            <span className={styles.sprinkle} />
            <span className={styles.sprinkle} />
          </div>

          <div className={styles.cakeSide}>
            <span className={styles.drip} />
            <span className={styles.drip} />
            <span className={styles.drip} />
            <span className={styles.drip} />
            <span className={styles.drip} />
            <span className={styles.sideSprinkle} />
            <span className={styles.sideSprinkle} />
            <span className={styles.sideSprinkle} />
            <span className={styles.sideSprinkle} />
            <span className={styles.sideSprinkle} />
            <span className={styles.sideSprinkle} />
            <span className={styles.layerLine} />
          </div>
        </motion.div>

        <div className={styles.plate} />

        {allCandlesOut && (
          <motion.div
            className={styles.sparkles}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            aria-hidden
          >
            <i />
            <i />
            <i />
            <i />
            <i />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className={styles.message}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 8 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {allCandlesOut ? (
          <>
            <p className={styles.wishText}>
              Make a wish
              <span>
                <SparkleIcon size={17} />
              </span>
            </p>
            <Button data-testid="continue" onClick={onNext} nudge guide>
              Continue
            </Button>
          </>
        ) : (
          <p>
            Tap each flame to blow out the candles
            <span className={styles.count}>{remaining} left</span>
          </p>
        )}
      </motion.div>
    </div>
  );
}
