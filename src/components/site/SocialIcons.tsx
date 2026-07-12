export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 8.5h2.5V5.3S15.2 5 13.8 5C11 5 9.5 6.6 9.5 9.4V12H7v3.2h2.5V21h3.2v-5.8h2.6l.4-3.2h-3V9.7c0-.9.3-1.2 1.3-1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.5 3h2.2c.2 1.6 1.3 2.9 3.3 3.2v2.3c-1.3 0-2.5-.4-3.5-1.1v6.4a5.3 5.3 0 1 1-4.6-5.3v2.4a2.9 2.9 0 1 0 2.1 2.8V3Z"
        fill="currentColor"
      />
    </svg>
  );
}
