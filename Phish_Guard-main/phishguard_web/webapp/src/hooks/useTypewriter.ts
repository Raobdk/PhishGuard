import { useEffect, useRef, useState, useCallback } from 'react';

export function useTypewriter(lines: { text: string; speed?: number; delay?: number }[], onComplete?: () => void) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (currentLineIdx >= lines.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      setIsTyping(false);
      return;
    }

    const line = lines[currentLineIdx];
    const speed = line.speed ?? 25;
    const delay = line.delay ?? 0;

    if (currentCharIdx === 0 && delay > 0) {
      const timer = setTimeout(() => setIsTyping(true), delay);
      return () => clearTimeout(timer);
    }

    setIsTyping(true);
    const fullText = line.text;

    if (currentCharIdx <= fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLineIdx] = fullText.slice(0, currentCharIdx);
          return next;
        });
        setCurrentCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLineIdx((i) => i + 1);
        setCurrentCharIdx(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentLineIdx, currentCharIdx, lines, onComplete]);

  const reset = useCallback(() => {
    completedRef.current = false;
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
    setIsTyping(false);
  }, []);

  return { displayedLines, currentLineIdx, isTyping, reset };
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
