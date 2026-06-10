export type ClockDisplay = {
  time: string;
  date: string;
};

export function formatClockDisplay(now: Date, locale = "en-US", timeZone?: string): ClockDisplay {
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  }).format(now);

  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(timeZone ? { timeZone } : {}),
  }).format(now);

  return { time, date };
}
