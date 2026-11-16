import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import StoreProvider from "@/components/providers/StoreProvider";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "אתר חדשות עם מצב כהה ובהיר, שיתוף כתבות, שמירה וחיפוש.",
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('now-theme');
    var dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${frank.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Suspense fallback={<div className="state-card">טוען...</div>}>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
