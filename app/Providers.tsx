// src/app/Providers.tsx

"use client"; // این خط بسیار مهم است

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}