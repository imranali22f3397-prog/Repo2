'use client';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, SPRING_SOFT } from '@/lib/motion';
import { makeRng } from '@/lib/random';
import { CameraIcon, CloseIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SceneHeading } from '@/components/ui/SceneHeading';

interface GallerySceneProps {
  photos: { id: string; ext: string }[];
  onNext: () => void;
}

export function GalleryScene({ photos, onNext }: GallerySceneProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const rotations = useMemo(() => {
    const rng = makeRng(331);
    return photos.map(() => -6 + rng() * 12);
  }, [photos]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen(i => (i === null ? i : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setOpen(i => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length]);

  if (photos.length === 0) {
    return (
      <>
        <Eyebrow>OUR MEMORIES</Eyebrow>
        <SceneHeading>
          Little moments, <em>big love.</em>
        </SceneHeading>
        <p>No photos this time — the memories still live here.</p>
        <Button data-testid="continue" onClick={onNext} nudge>
          Continue
        </Button>
      </>
    );
  }

  return (
    <>
      <Eyebrow>OUR MEMORIES</Eyebrow>
      <SceneHeading>
        Little moments, <em>big love.</em>
      </SceneHeading>
      <p>Tap a photo to see it up close.</p>
      <div className="polaroid-grid">
        {photos.map((p, i) => {
          const src = `/api/photo/${p.id}.${p.ext}`;
          return (
            <motion.button
              key={p.id}
              type="button"
              className="polaroid"
              aria-label={`Open memory ${i + 1}`}
              style={{ rotate: rotations[i] }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.5, duration: 0.45, ease: EASE_OUT }}
              onClick={() => setOpen(i)}
            >
              <img src={src} alt="" loading="lazy" />
              {!reduce && (
                <motion.span
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.5 }}
                  style={{
                    position: 'absolute',
                    inset: 8,
                    bottom: 28,
                    background: '#fff',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <Button data-testid="continue" onClick={onNext} nudge>
        Continue
      </Button>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              key={photos[open].id}
              src={`/api/photo/${photos[open].id}.${photos[open].ext}`}
              alt={`Memory ${open + 1}`}
              className="lightbox-image"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) setOpen((open + 1) % photos.length);
                if (info.offset.x > 60) setOpen((open - 1 + photos.length) % photos.length);
              }}
              initial={reduce ? { opacity: 0 } : { scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING_SOFT}
              onClick={e => e.stopPropagation()}
            />
            <div style={{ position: 'absolute', bottom: 28, color: '#fff', fontSize: 13 }}>
              {open + 1} / {photos.length}
            </div>
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close photo"
              onClick={() => setOpen(null)}
            >
              <CloseIcon size={18} />
            </button>
            <CameraIcon size={18} style={{ position: 'absolute', top: 22, left: 22, opacity: 0.7 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
