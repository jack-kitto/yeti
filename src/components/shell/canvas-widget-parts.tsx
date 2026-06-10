"use client";

import { useEffect, useState } from "react";
import { formatClockDisplay, formatEditorialClockDisplay } from "@/canvas-widgets/clock";
import { pickQuote } from "@/canvas-widgets/quote";
import { formatWelcomeMessage } from "@/canvas-widgets/welcome";

export function CanvasClockTimeWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const { time } = formatClockDisplay(now);

  return (
    <div className="canvas-widget canvas-widget-clock canvas-widget-clock--hero-time">
      <p className="canvas-widget-clock-time">{time}</p>
    </div>
  );
}

export function CanvasClockDateHeroWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const { dateHero, weekday } = formatEditorialClockDisplay(now);

  return (
    <div className="canvas-widget canvas-widget-clock canvas-widget-clock--hero-date">
      <p className="canvas-widget-clock-date-hero">{dateHero}</p>
      <p className="canvas-widget-clock-weekday-pill">{weekday}</p>
    </div>
  );
}

export function CanvasWelcomeWidget({ workspaceName }: { workspaceName: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="canvas-widget canvas-widget-welcome">{formatWelcomeMessage(workspaceName, now)}</p>
  );
}

export function CanvasQuoteWidget() {
  const [quote] = useState(() => pickQuote(Math.floor(Date.now() / 86_400_000)));

  return <p className="canvas-widget canvas-widget-quote">{quote.text}</p>;
}
