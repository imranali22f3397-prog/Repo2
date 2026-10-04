import { useEffect, useRef, useState } from 'react';

export function useTimeouts() {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const later = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      fn();
    }, ms);
    timersRef.current.add(timer);
  };

  const clearAll = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
  };

  useEffect(() => {
    return () => clearAll();
  }, []);

  return { later, clearAll };
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
