import { getStartPageStubLabel } from "@/start/start-page";

export default function StartPage() {
  return (
    <main className="flex min-h-screen items-center justify-center text-sm opacity-70">
      {getStartPageStubLabel()}
    </main>
  );
}
