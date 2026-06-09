"use client";

import { useEffect, useRef } from "react";

type StartPageCommandBarProps = {
  placeholder: string;
  autoFocus?: boolean;
};

export function StartPageCommandBar({
  placeholder,
  autoFocus = true,
}: StartPageCommandBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        aria-label="Command bar"
        autoFocus={autoFocus}
        className="w-full rounded-[var(--qs-border-radius)] border border-white/20 bg-[color:var(--qs-color-surface)]/80 px-4 py-2.5 text-sm text-[color:var(--qs-color-text)] shadow-sm backdrop-blur-sm outline-none ring-[color:var(--qs-color-accent)] focus:ring-2"
      />
    </div>
  );
}
