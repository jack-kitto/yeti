export function formatWelcomeMessage(
  workspaceName: string,
  now: Date,
  timeZone?: string,
): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      ...(timeZone ? { timeZone } : {}),
    }).format(now),
  );

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return `${greeting}, ${workspaceName}`;
}
