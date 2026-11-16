"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import {
  ARTICLE_CACHE_KEY,
  BOOKMARKS_KEY,
  COUNTRY_KEY,
  LOCALE_KEY,
  THEME_KEY,
} from "@/lib/constants";
import { isUiLocale } from "@/lib/i18n";
import { makeStore, type AppStore } from "@/lib/store";
import { hydrateNewsCache, setCountry } from "@/lib/store/newsSlice";
import { hydrateUi } from "@/lib/store/uiSlice";
import type { Article, ThemeMode } from "@/types/news";

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export default function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  const store = storeRef.current;

  useEffect(() => {
    if (!store) return;

    const storedTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme: ThemeMode =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

    const storedLocale = localStorage.getItem(LOCALE_KEY);
    store.dispatch(
      hydrateUi({
        theme,
        bookmarks: readJson<Article[]>(BOOKMARKS_KEY, []),
        locale: isUiLocale(storedLocale) ? storedLocale : "he",
      }),
    );
    store.dispatch(hydrateNewsCache(readJson(ARTICLE_CACHE_KEY, {})));

    const country = localStorage.getItem(COUNTRY_KEY);
    if (country) store.dispatch(setCountry(country));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
