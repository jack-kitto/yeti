"use client";

import { useEffect, useRef } from "react";

const BAR_COUNT = 5;

type CanvasNowPlayingVisualizerProps = {
  active: boolean;
  getAnalyser?: () => AnalyserNode | null;
};

export function CanvasNowPlayingVisualizer({
  active,
  getAnalyser,
}: CanvasNowPlayingVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const analyser = getAnalyser?.() ?? null;
    const frequencyData = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let frame = 0;
    let animationId = 0;

    const draw = (timestamp: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * devicePixelRatio) {
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }

      context.clearRect(0, 0, width, height);

      const accent =
        getComputedStyle(canvas).getPropertyValue("--qs-color-accent").trim() || "#788cc8";

      const gap = 4;
      const barWidth = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const phase = timestamp / 280;

      for (let index = 0; index < BAR_COUNT; index++) {
        let level = 0.2;
        if (analyser && frequencyData) {
          analyser.getByteFrequencyData(frequencyData);
          const sample = frequencyData[index + 1] ?? frequencyData[index] ?? 0;
          level = Math.max(0.12, sample / 255);
        } else {
          level = 0.18 + Math.abs(Math.sin(phase + index * 0.9)) * 0.42;
        }

        const barHeight = Math.max(4, height * level);
        const x = index * (barWidth + gap);
        const y = (height - barHeight) / 2;
        const gradient = context.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, accent);
        gradient.addColorStop(1, withAlpha(accent, 0.35));
        context.fillStyle = gradient;
        context.beginPath();
        context.roundRect(x, y, barWidth, barHeight, 999);
        context.fill();
      }
      animationId = window.requestAnimationFrame(draw);
    };

    animationId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animationId);
  }, [active, getAnalyser]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-now-playing-visualizer"
      aria-hidden
    />
  );
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("#") && color.length === 7) {
    const r = Number.parseInt(color.slice(1, 3), 16);
    const g = Number.parseInt(color.slice(3, 5), 16);
    const b = Number.parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
}
