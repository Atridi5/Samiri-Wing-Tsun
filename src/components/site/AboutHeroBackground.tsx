const PARTICLES = [
  { left: "8%", size: 3, delay: "0s", duration: "9s" },
  { left: "18%", size: 2, delay: "2s", duration: "11s" },
  { left: "28%", size: 4, delay: "1s", duration: "8s" },
  { left: "40%", size: 2, delay: "4s", duration: "12s" },
  { left: "52%", size: 3, delay: "0.5s", duration: "10s" },
  { left: "63%", size: 2, delay: "3s", duration: "9s" },
  { left: "74%", size: 4, delay: "1.5s", duration: "13s" },
  { left: "85%", size: 3, delay: "2.5s", duration: "10s" },
  { left: "93%", size: 2, delay: "0.8s", duration: "11s" },
];

export default function AboutHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glow orbs */}
      <div className="animate-float-drift-1 absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
      <div className="animate-float-drift-2 absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Rotating rings, evoking a Wing Tsun emblem */}
      <svg
        className="animate-spin-slow absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="180" stroke="#d4af37" strokeWidth="1" strokeDasharray="4 10" />
      </svg>
      <svg
        className="animate-spin-slow-reverse absolute left-1/2 top-1/2 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
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
