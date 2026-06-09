function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length !== 6) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbaFromHex(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return `rgba(255, 253, 249, ${alpha})`;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function shellFillAlphas(glassOpacity: number) {
  const glass = Math.min(Math.max(glassOpacity, 0.4), 1);
  return {
    rim: Math.min(0.58 + glass * 0.38, 0.96),
    notch: Math.min(0.9 + glass * 0.1, 0.99),
  };
}
