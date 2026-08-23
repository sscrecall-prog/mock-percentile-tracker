import confetti from 'canvas-confetti';

export const triggerCelebrationConfetti = () => {
  if (typeof window === 'undefined') return;

  const count = 150;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#00D2FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#FFFFFF']
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Multi-burst fireworks
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
