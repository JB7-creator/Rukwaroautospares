import { useEffect, useState } from 'react';

/**
 * Countdown to the next midnight East Africa Time (UTC+3).
 * Powers the Deal of the Day timer — resets every day so there's
 * always a reason to come back tomorrow.
 */
export interface TimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function msUntilNextMidnightEAT(now: Date): number {
  // EAT = UTC+3 → next EAT midnight = next 21:00 UTC
  const nextEodUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    21, 0, 0, 0
  );
  // If we're before 21:00 UTC today, that's already tomorrow EAT — correct.
  // If we're after (21:00–23:59 UTC = midnight-2:59am EAT next day), roll one more day.
  const nowUtcMs = now.getTime();
  if (nextEodUtc - nowUtcMs <= 0) {
    return nextEodUtc + 24 * 60 * 60 * 1000 - nowUtcMs;
  }
  return nextEodUtc - nowUtcMs;
}

export function useDailyCountdown(): TimeLeft {
  const compute = (): TimeLeft => {
    const ms = msUntilNextMidnightEAT(new Date());
    const totalSeconds = Math.floor(ms / 1000);
    return {
      hours: pad(Math.floor(totalSeconds / 3600)),
      minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
      seconds: pad(totalSeconds % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(compute);

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(compute()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return timeLeft;
}

/**
 * Stable day index (days since epoch) — use to rotate deals/products daily
 * without any backend.
 */
export function getDayIndex(): number {
  return Math.floor((Date.now() - 3 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000));
}
