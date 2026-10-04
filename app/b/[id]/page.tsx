'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { EASE_OUT, EASE_INOUT } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';
import { HeartIcon } from '@/components/icons';
import { Backdrop } from '@/components/recipient/Backdrop';
import { SceneCard } from '@/components/recipient/SceneCard';
import { ChapterOverlay } from '@/components/recipient/ChapterOverlay';
import { PasswordScreen } from '@/components/recipient/PasswordScreen';
import { CakeScene } from '@/components/recipient/CakeScene';
import { DateScene } from '@/components/recipient/DateScene';
import { NameScene } from '@/components/recipient/NameScene';
import { MessageScene } from '@/components/recipient/MessageScene';
import { BalloonScene } from '@/components/recipient/BalloonScene';
import { LetterScene } from '@/components/recipient/LetterScene';
import { GalleryScene } from '@/components/recipient/GalleryScene';
import { FinalScene } from '@/components/recipient/FinalScene';
import { AudioProvider, useBloomAudio } from '@/components/recipient/AudioProvider';

type Data = {
  date: string;
  recipientName: string;
  messages: string[];
  letter: string;
  wishes: string[];
  photos: { id: string; ext: string }[];
};

function BirthdayInner({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [step, setStep] = useState(-1);
  const [err, setErr] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [candlesExtinguished, setCandlesExtinguished] = useState<number[]>([]);
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [chapterTransition, setChapterTransition] = useState<string | null>(null);
  const { later, clearAll } = useTimeouts();
  const audio = useBloomAudio();

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/experience/${id}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  }, [id]);

  const showChapter = (title: string, nextStep: number) => {
    setChapterTransition(title);
    later(() => {
      setChapterTransition(null);
      setStep(nextStep);
    }, 2000);
  };

  const checkPassword = async (password: string) => {
    audio.unlock();
    try {
      const r = await fetch(`/api/experience/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        setPasswordError(false);
        setUnlocking(true);
        later(() => {
          setChapterTransition('CHAPTER 01: Your Special Day');
          later(() => {
            setChapterTransition(null);
            setStep(0);
          }, 2000);
        }, 800);
      } else {
        setUnlocking(false);
        setPasswordError(true);
      }
    } catch {
      setUnlocking(false);
      setPasswordError(true);
    }
  };

  const resetJourney = () => {
    clearAll();
    setStep(0);
    setCandlesExtinguished([]);
    setPoppedBalloons([]);
    setChapterTransition(null);
    setUnlocking(false);
  };

  if (err) {
    return (
      <main className="recipient">
        <Backdrop step={step} />
        <SceneCard>
          <HeartIcon size={40} />
          <h1>Oh, this link wandered off.</h1>
          <p>This birthday surprise may have expired or the link may be incorrect.</p>
        </SceneCard>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="recipient">
        <Backdrop step={step} />
        <SceneCard>
          <div className="loader-heart">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: EASE_INOUT }}
            >
              <HeartIcon size={48} />
            </motion.div>
            <p>Unwrapping a little surprise…</p>
          </div>
        </SceneCard>
      </main>
    );
  }

  const sceneVariants = {
    initial: { opacity: 0, y: 16, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
    exit: { opacity: 0, y: -12, scale: 1.02, transition: { duration: 0.35, ease: EASE_INOUT } },
  };

  return (
    <main className={`recipient ${step === 10 ? 'finalbg' : ''}`} data-step={step}>
      <Backdrop step={step} />
      <AnimatePresence>{chapterTransition && <ChapterOverlay chapterTransition={chapterTransition} />}</AnimatePresence>
      <div className="recipientbar">
        <span className="brand">
          <span className="brandmark" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartIcon size={14} />
          </span>{' '}
          bloom<span className="brandlight">day</span>
        </span>
        <span>{step >= 0 ? 'MADE JUST FOR YOU' : 'A LITTLE SURPRISE'}</span>
      </div>
      <AnimatePresence mode="wait">
        {step === 10 ? (
          <FinalScene key="final" recipientName={data.recipientName} onReplay={resetJourney} />
        ) : (
          <motion.div key={step} variants={sceneVariants} initial="initial" animate="animate" exit="exit">
            <SceneCard>
              {step === -1 && (
                <PasswordScreen
                  recipientName={data.recipientName}
                  passwordError={passwordError}
                  unlocking={unlocking}
                  onPasswordSubmit={checkPassword}
                />
              )}
              {step === 0 && (
                <CakeScene
                  candlesExtinguished={candlesExtinguished}
                  onExtinguishCandle={i => {
                    audio.play('chime');
                    setCandlesExtinguished(prev => (prev.includes(i) ? prev : [...prev, i]));
                  }}
                  onNext={() => showChapter('CHAPTER 02: A Few Things I Want To Say', 1)}
                />
              )}
              {step === 1 && (
                <DateScene date={data.date} onNext={() => showChapter('CHAPTER 03: Just For You', 2)} />
              )}
              {step === 2 && (
                <NameScene recipientName={data.recipientName} onNext={() => showChapter('CHAPTER 04: A Few Things I Want To Say', 3)} />
              )}
              {step === 3 && (
                <MessageScene message={data.messages[0]} messageIndex={0} onNext={() => setStep(4)} />
              )}
              {step === 4 && (
                <MessageScene message={data.messages[1]} messageIndex={1} onNext={() => setStep(5)} />
              )}
              {step === 5 && (
                <MessageScene message={data.messages[2]} messageIndex={2} onNext={() => setStep(6)} />
              )}
              {step === 6 && (
                <MessageScene message={data.messages[3]} messageIndex={3} onNext={() => showChapter('CHAPTER 05: Make A Wish', 7)} />
              )}
              {step === 7 && (
                <BalloonScene
                  wishes={data.wishes}
                  poppedBalloons={poppedBalloons}
                  onPopBalloon={i => setPoppedBalloons(prev => (prev.includes(i) ? prev : [...prev, i]))}
                  onNext={() => showChapter('CHAPTER 06: From The Heart', 8)}
                />
              )}
              {step === 8 && (
                <LetterScene letter={data.letter} onNext={() => showChapter('CHAPTER 07: Our Memories', 9)} />
              )}
              {step === 9 && (
                <GalleryScene photos={data.photos} onNext={() => showChapter('CHAPTER 08: One Last Surprise', 10)} />
              )}
            </SceneCard>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Birthday({ params }: { params: Promise<{ id: string }> }) {
  return (
    <MotionConfig reducedMotion="user">
      <AudioProvider>
        <BirthdayInner params={params} />
      </AudioProvider>
    </MotionConfig>
  );
}
