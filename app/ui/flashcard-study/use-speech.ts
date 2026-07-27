'use client';

import { useCallback, useRef } from 'react';

/**
 * Hook TTS sử dụng Web Speech API (SpeechSynthesis).
 * Hoạt động hoàn toàn phía client, không cần API key.
 *
 * @param frontLang  BCP 47 language code cho mặt trước (term), e.g. 'en-US'
 * @param backLang   BCP 47 language code cho mặt sau (definition), e.g. 'vi-VN'
 */
export function useSpeech(frontLang: string, backLang: string) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Dừng bất kỳ speech đang chạy trước
    window.speechSynthesis.cancel();

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;  // Hơi chậm hơn tốc độ mặc định để dễ nghe
    utterance.pitch = 1;
    utterance.volume = 1;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  /** Đọc text mặt trước (term) */
  const speakFront = useCallback(
    (text: string) => speak(text, frontLang),
    [speak, frontLang]
  );

  /** Đọc text mặt sau (definition) */
  const speakBack = useCallback(
    (text: string) => speak(text, backLang),
    [speak, backLang]
  );

  /** Dừng speech hiện tại */
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speakFront, speakBack, stop };
}
