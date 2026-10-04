'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { SpeakerIcon, SpeakerOffIcon } from '@/components/icons';

type Cue = 'chime' | 'pop' | 'rustle' | 'swell';

interface AudioApi {
  muted: boolean;
  enabled: boolean;
  setMuted: (v: boolean) => void;
  unlock: () => void;
  play: (cue: Cue) => void;
}

const AudioCtx = createContext<AudioApi | null>(null);

export function useBloomAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    return {
      muted: true,
      enabled: false,
      setMuted: () => {},
      unlock: () => {},
      play: () => {},
    };
  }
  return ctx;
}

function tone(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
  gain = 0.08,
  at = 0
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + at);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(ctx.currentTime + at);
  osc.stop(ctx.currentTime + at + duration + 0.02);
}

function noiseBurst(ctx: AudioContext, duration: number, freq = 900) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.05, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  src.start();
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const resume = useCallback(async () => {
    const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!ctxRef.current) ctxRef.current = new AC();
    if (ctxRef.current.state === 'suspended') await ctxRef.current.resume();
  }, []);

  const unlock = useCallback(() => {
    setEnabled(true);
    setMuted(false);
    void resume();
  }, [resume]);

  const play = useCallback(
    (cue: Cue) => {
      if (muted || !enabled) return;
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (cue === 'chime') {
        tone(ctx, 784, 0.18, 'sine', 0.06);
        tone(ctx, 1175, 0.22, 'sine', 0.04, 0.05);
      } else if (cue === 'pop') {
        tone(ctx, 220, 0.08, 'triangle', 0.07);
        noiseBurst(ctx, 0.08, 1400);
      } else if (cue === 'rustle') {
        noiseBurst(ctx, 0.28, 700);
      } else if (cue === 'swell') {
        tone(ctx, 392, 0.8, 'sine', 0.05);
        tone(ctx, 523, 1.1, 'sine', 0.04, 0.12);
        tone(ctx, 659, 1.3, 'sine', 0.03, 0.24);
      }
    },
    [muted, enabled]
  );

  useEffect(() => {
    const el = new Audio('/audio/ambient.mp3');
    el.loop = true;
    el.volume = 0.18;
    ambientRef.current = el;
    const probe = fetch('/audio/ambient.mp3', { method: 'HEAD' }).then(r => {
      if (!r.ok) ambientRef.current = null;
    }).catch(() => {
      ambientRef.current = null;
    });
    return () => {
      void probe;
      el.pause();
      ambientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = ambientRef.current;
    if (!el) return;
    if (!muted && enabled) void el.play().catch(() => {});
    else el.pause();
  }, [muted, enabled]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        ctxRef.current?.suspend();
        ambientRef.current?.pause();
      } else if (!muted && enabled) {
        void ctxRef.current?.resume();
        void ambientRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      ctxRef.current?.close();
      ctxRef.current = null;
      ambientRef.current?.pause();
    };
  }, [muted, enabled]);

  return (
    <AudioCtx.Provider value={{ muted, enabled, setMuted, unlock, play }}>
      {children}
      {enabled && (
        <button
          type="button"
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          onClick={() => setMuted(!muted)}
          className="audio-toggle"
        >
          {muted ? <SpeakerOffIcon size={18} /> : <SpeakerIcon size={18} />}
        </button>
      )}
    </AudioCtx.Provider>
  );
}
