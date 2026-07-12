const PARTICLES = [
  { left: "6%", size: 3, delay: "0s", duration: "9s" },
  { left: "14%", size: 2, delay: "2s", duration: "11s" },
  { left: "22%", size: 4, delay: "1s", duration: "8s" },
  { left: "31%", size: 2, delay: "4s", duration: "12s" },
  { left: "40%", size: 3, delay: "0.5s", duration: "10s" },
  { left: "49%", size: 2, delay: "3s", duration: "9s" },
  { left: "58%", size: 4, delay: "1.5s", duration: "13s" },
  { left: "67%", size: 3, delay: "2.5s", duration: "10s" },
  { left: "76%", size: 2, delay: "0.8s", duration: "11s" },
  { left: "84%", size: 3, delay: "3.5s", duration: "9s" },
  { left: "92%", size: 2, delay: "1.8s", duration: "12s" },
];

export default function AboutHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glow orbs */}
      <div className="animate-float-drift-1 absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="animate-float-drift-2 absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Central 3D-tilted emblem */}
      <div className="animate-tilt-3d absolute left-1/2 top-1/2 h-[70vh] w-[70vh] max-h-[520px] max-w-[520px] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 400 400" fill="none" className="h-full w-full" aria-hidden="true">
          <circle cx="200" cy="200" r="190" stroke="#d4af37" strokeWidth="1" opacity="0.18" />
          <circle cx="200" cy="200" r="150" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 9" opacity="0.22" />
          <circle cx="200" cy="200" r="110" stroke="#e8cf82" strokeWidth="1.5" opacity="0.15" />
          <path
            d="M200 60 C260 100, 260 300, 200 340 C140 300, 140 100, 200 60Z"
            stroke="#d4af37"
            strokeWidth="1"
            opacity="0.14"
          />
        </svg>
      </div>

      {/* Rotating rings */}
      <svg
        className="animate-spin-slow absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="180" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 10" />
      </svg>
      <svg
        className="animate-spin-slow-reverse absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="150" stroke="#d4af37" strokeWidth="1" />
      </svg>

      {/* Rising particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-particle-rise absolute bottom-0 rounded-full bg-gold-400"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
