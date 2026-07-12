"use client";

import { useState } from "react";
import RegisterModal from "./RegisterModal";

export default function RegisterButton({
  className,
  children,
  onOpen,
}: {
  className?: string;
  children: React.ReactNode;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          onOpen?.();
        }}
        className={className}
      >
        {children}
      </button>
      <RegisterModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
