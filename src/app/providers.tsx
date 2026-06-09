"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { LibrarySyncSubscriber } from "@/components/library-sync-subscriber";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LibrarySyncSubscriber queryClient={queryClient} />
      {children}
    </QueryClientProvider>
  );
}
