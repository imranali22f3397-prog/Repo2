'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, SPRING_SOFT } from '@/lib/motion';
import { HeartIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface DateSceneProps {
  date: string;
  onNext: () => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
    monthName: date.toLocaleDateString('en-US', { month: 'long' }),
    pretty: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    startWeekday: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
  };
}

export function DateScene({ date, onNext }: DateSceneProps) {
  const reduce = useReducedMotion();
  const info = useMemo(() => parseDate(date), [date]);
  const [focusDay, setFocusDay] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setFocusDay(true), reduce ? 200 : 1400);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const cells: Array<number | null> = [
    ...Array.from({ length: info.startWeekday }, () => null),
    ...Array.from({ length: info.daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <>
      <Eyebrow>YOUR SPECIAL DAY</Eyebrow>
      <div className="calendar-card" data-testid="calendar">
        <motion.div
          className="calendar-head"
          initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: -70 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          style={{ transformOrigin: 'top', perspective: 600 }}
        >
          {info.monthName} {info.year}
        </motion.div>
        <div className="calendar-week">
          {WEEKDAYS.map(d => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="calendar-grid">
          {cells.map((n, i) => {
            const isBday = n === info.day;
            return (
              <motion.div
                key={i}
                className={`calendar-cell ${n && !isBday && focusDay ? 'dim' : ''}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: focusDay && isBday ? 1.04 : 1 }}
                transition={{ delay: reduce ? 0 : i * 0.015, duration: 0.28, ease: EASE_OUT }}
              >
                {n ?? ''}
                {isBday && (
                  <>
                    <motion.svg
                      viewBox="0 0 36 36"
                      className="calendar-ring"
                      aria-hidden="true"
                    >
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="#e0527e"
                        strokeWidth="1.6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, delay: 0.4, ease: EASE_OUT }}
                      />
                    </motion.svg>
                    <motion.span
                      style={{ position: 'absolute', top: -10, right: -4 }}
                      initial={{ scale: 0, y: -12 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={SPRING_SOFT}
                    >
                      <HeartIcon size={12} />
                    </motion.span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <motion.h1
        animate={focusDay && !reduce ? { scale: 1.18 } : { scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        style={{ filter: focusDay && !reduce ? 'none' : undefined }}
      >
        {info.pretty}
      </motion.h1>
      <Button data-testid="continue" onClick={onNext} nudge>
        Continue
      </Button>
    </>
  );
}
