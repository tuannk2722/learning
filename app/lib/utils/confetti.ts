import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const duration = 1500; // 1.5 seconds
  const end = Date.now() + duration;

  const frame = () => {
    // Launch from left edge
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#3b82f6']
    });
    // Launch from right edge
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#3b82f6']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};
