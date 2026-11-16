"use client";

import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PersistState from "@/components/providers/PersistState";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <PersistState />
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
