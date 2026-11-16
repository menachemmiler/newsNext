"use client";

import { Suspense, type ReactNode } from "react";
import CategoryNav from "@/components/layout/CategoryNav";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PersistState from "@/components/providers/PersistState";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <PersistState />
      <Header />
      <Suspense fallback={null}>
        <CategoryNav />
      </Suspense>
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
