import type { ShellSurface } from "@/library/types";

const TRANSPARENT_FILL_SCALE = 0.52;

export function shellFillAlphas(shellSurface: ShellSurface, glassOpacity: number) {
  const glass = Math.min(Math.max(glassOpacity, 0.2), 1);

  if (shellSurface === "solid") {
    return { rim: 1, notch: 1 };
  }

  const rim = Math.min(0.58 + glass * 0.38, 0.96);
  const notch = Math.min(0.9 + glass * 0.1, 0.99);

  if (shellSurface === "transparent") {
    return {
      rim: rim * TRANSPARENT_FILL_SCALE,
      notch: notch * TRANSPARENT_FILL_SCALE,
    };
  }

  return { rim, notch };
}

export function shellBackdropBlur(shellSurface: ShellSurface): number {
  if (shellSurface === "solid") {
    return 0;
  }

  return shellSurface === "transparent" ? 16 : 24;
}
