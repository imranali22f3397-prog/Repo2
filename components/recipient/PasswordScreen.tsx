'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { makeRng } from '@/lib/random';
import { EyeIcon, EyeOffIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface PasswordScreenProps {
  recipientName: string;
  passwordError: boolean;
  unlocking: boolean;
  onPasswordSubmit: (password: string) => void;
}

export function PasswordScreen({
  recipientName,
  passwordError,
  unlocking,
  onPasswordSubmit,
}: PasswordScreenProps) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [burst, setBurst] = useState<Array<{ x: number; y: number; c: string }>>([]);

  useEffect(() => {
    if (!unlocking) return;
    const rng = makeRng(2201);
    setBurst(
      Array.from({ length: 14 }, () => ({
        x: (rng() - 0.5) * 160,
        y: (rng() - 0.5) * 120,
        c: rng() > 0.5 ? '#f5c26b' : '#f4a3bd',
      }))
    );
  }, [unlocking]);

  const submit = () => {
    if (!value.trim()) return;
    onPasswordSubmit(value);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="lock-wrap">
        <motion.svg
          viewBox="0 0 72 72"
          width={72}
          height={72}
          aria-hidden
          animate={
            passwordError && !reduce
              ? { x: [0, -8, 8, -5, 5, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <defs>
            <linearGradient id="lock-body" x1="16" y1="30" x2="56" y2="64">
              <stop offset="0%" stopColor="#f4a3bd" />
              <stop offset="100%" stopColor="#b0345a" />
            </linearGradient>
          </defs>
          <motion.path
            d="M24 32V24a12 12 0 0 1 24 0v8"
            fill="none"
            stroke="#b0345a"
            strokeWidth="3.2"
            strokeLinecap="round"
            style={{ transformOrigin: '48px 24px' }}
            animate={
              unlocking && !reduce
                ? { y: -10, rotate: -28 }
                : { y: 0, rotate: 0 }
            }
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />
          <rect x="16" y="32" width="40" height="28" rx="6" fill="url(#lock-body)" stroke="#8a2a4a" strokeWidth="1.6" />
          <circle cx="36" cy="44" r="4" fill="#fff7f2" />
          <path d="M36 48v5" stroke="#fff7f2" strokeWidth="2.2" strokeLinecap="round" />
        </motion.svg>
      </div>

      <Eyebrow>YOUR SURPRISE AWAITS</Eyebrow>
      <h1>
        Hey,
        <br />
        <em>{recipientName}.</em>
      </h1>
      <p>Someone created a special birthday surprise just for you. Enter the password to unlock it.</p>

      <div className={`field float ${passwordError ? 'error-flash' : ''}`}>
        <label htmlFor="unlock-password">PASSWORD</label>
        <input
          id="unlock-password"
          type={show ? 'text' : 'password'}
          value={value}
          autoComplete="off"
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{
            borderColor: passwordError ? '#e0527e' : undefined,
            paddingRight: 48,
          }}
        />
        <button
          type="button"
          className="eye-btn"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow(s => !s)}
        >
          {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
        </button>
        {passwordError && <p className="error">Incorrect password. Please try again.</p>}
      </div>

      <Button data-testid="unlock" onClick={submit} disabled={unlocking}>
        Unlock surprise
      </Button>

      {unlocking && (
        <>
          <div className="gold-sweep" aria-hidden>
            <motion.span
              initial={{ x: '-20%' }}
              animate={{ x: '280%' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              style={{ display: 'block', height: '100%', width: '40%' }}
            />
          </div>
          {!reduce &&
            burst.map((p, i) => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.4 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 40,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: p.c,
                  pointerEvents: 'none',
                }}
              />
            ))}
        </>
      )}
    </div>
  );
}
