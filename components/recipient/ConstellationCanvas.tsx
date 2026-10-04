'use client';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { makeRng } from '@/lib/random';
import { heartPoints } from '@/lib/heart';

export interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
  phase: number;
  tx: number;
  ty: number;
  isHeart: boolean;
  dim: boolean;
}

export interface LineSeg {
  p: number;
}

export interface PulseState {
  value: number;
}

export interface ConstellationCanvasRef {
  starsRef: React.MutableRefObject<Star[]>;
  lineProgressRef: React.MutableRefObject<LineSeg[]>;
  pulseRef: React.MutableRefObject<PulseState>;
  recomputeTargets: () => void;
}

interface ConstellationCanvasProps {
  onReady?: () => void;
}

function assignTargets(stars: Star[], w: number, h: number, rng: () => number) {
  const heartWidth = Math.min(w * 0.7, 360, h * 0.4);
  const cx = w / 2;
  const cy = h * 0.44;
  const pointCount = w <= 640 ? 30 : 48;
  const heartTargets = heartPoints(pointCount, cx, cy, heartWidth);
  const heartStarCount = Math.min(stars.length, heartTargets.length);

  for (let i = 0; i < heartStarCount; i++) {
    stars[i].tx = heartTargets[i].x;
    stars[i].ty = heartTargets[i].y;
    stars[i].isHeart = true;
    stars[i].dim = false;
  }

  for (let i = heartStarCount; i < stars.length; i++) {
    const angle = Math.atan2(stars[i].y - cy, stars[i].x - cx);
    const drift = 20 + rng() * 20;
    stars[i].tx = stars[i].x + Math.cos(angle) * drift;
    stars[i].ty = stars[i].y + Math.sin(angle) * drift;
    stars[i].isHeart = false;
    stars[i].dim = true;
  }

  return heartStarCount;
}

export const ConstellationCanvas = forwardRef<ConstellationCanvasRef, ConstellationCanvasProps>(
  ({ onReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const lineProgressRef = useRef<LineSeg[]>([]);
    const pulseRef = useRef<PulseState>({ value: 1 });
    const sizeRef = useRef({ w: 0, h: 0 });
    const rngRef = useRef(makeRng(12345));
    const animationFrameId = useRef<number | null>(null);
    const pausedRef = useRef(false);
    const onReadyRef = useRef(onReady);
    onReadyRef.current = onReady;

    useImperativeHandle(ref, () => ({
      starsRef,
      lineProgressRef,
      pulseRef,
      recomputeTargets: () => {
        const w = sizeRef.current.w || window.innerWidth;
        const h = sizeRef.current.h || window.innerHeight;
        const heartStarCount = assignTargets(starsRef.current, w, h, rngRef.current);
        lineProgressRef.current = Array.from({ length: heartStarCount }, () => ({ p: 0 }));
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const applyCanvasSize = (w: number, h: number) => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeRef.current = { w, h };
      };

      const w0 = window.innerWidth;
      const h0 = window.innerHeight;
      applyCanvasSize(w0, h0);

      const rng = makeRng(12345);
      rngRef.current = rng;
      const starCount = w0 <= 640 ? 36 : 60;
      const stars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: rng() * w0,
          y: rng() * h0,
          r: 0.8 + rng() * 1.4,
          alpha: 0.25 + rng() * 0.75,
          speed: 0.5 + rng() * 1.5,
          phase: rng() * Math.PI * 2,
          tx: 0,
          ty: 0,
          isHeart: false,
          dim: false,
        });
      }

      starsRef.current = stars;
      const heartStarCount = assignTargets(stars, w0, h0, rng);
      lineProgressRef.current = Array.from({ length: heartStarCount }, () => ({ p: 0 }));
      pulseRef.current.value = 1;

      onReadyRef.current?.();

      let time = 0;
      const animate = () => {
        if (pausedRef.current) {
          animationFrameId.current = requestAnimationFrame(animate);
          return;
        }

        time += 0.016;
        const { w, h } = sizeRef.current;
        ctx.clearRect(0, 0, w, h);

        const currentStars = starsRef.current;
        const lineProgress = lineProgressRef.current;
        const pulse = pulseRef.current.value;
        const n = lineProgress.length;
        const cx = w / 2;
        const cy = h * 0.44;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.translate(-cx, -cy);

        if (n > 1) {
          ctx.strokeStyle = 'rgba(244, 184, 200, 0.35)';
          ctx.lineWidth = 1;

          for (let i = 0; i < n; i++) {
            const progress = lineProgress[i]?.p ?? 0;
            if (progress <= 0) continue;
            const star = currentStars[i];
            const nextStar = currentStars[(i + 1) % n];
            if (!star || !nextStar) continue;
            const endX = star.x + (nextStar.x - star.x) * progress;
            const endY = star.y + (nextStar.y - star.y) * progress;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
        }

        currentStars.forEach(star => {
          const twinkle = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase));
          const alpha = star.dim ? Math.min(star.alpha, 0.15) : star.alpha * twinkle;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        });

        ctx.restore();
        animationFrameId.current = requestAnimationFrame(animate);
      };

      animationFrameId.current = requestAnimationFrame(animate);

      const onResize = () => {
        const prev = sizeRef.current;
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (!prev.w || !prev.h) {
          applyCanvasSize(w, h);
          return;
        }
        const sx = w / prev.w;
        const sy = h / prev.h;
        starsRef.current.forEach(star => {
          star.x *= sx;
          star.y *= sy;
          star.tx *= sx;
          star.ty *= sy;
        });
        applyCanvasSize(w, h);
        const heartStarCount = assignTargets(starsRef.current, w, h, rngRef.current);
        const prevLines = lineProgressRef.current;
        lineProgressRef.current = Array.from({ length: heartStarCount }, (_, i) => ({
          p: prevLines[i]?.p ?? 0,
        }));
      };

      const onVisibility = () => {
        pausedRef.current = document.hidden;
      };

      window.addEventListener('resize', onResize);
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        if (animationFrameId.current !== null) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    );
  }
);

ConstellationCanvas.displayName = 'ConstellationCanvas';
