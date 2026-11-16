"use client";

import { useEffect } from "react";
import {
  ARTICLE_CACHE_KEY,
  BOOKMARKS_KEY,
  COUNTRY_KEY,
  LOCALE_KEY,
  THEME_KEY,
} from "@/lib/constants";
import { useAppSelector } from "@/lib/store/hooks";

export default function PersistState() {
  const theme = useAppSelector((state) => state.ui.theme);
  const locale = useAppSelector((state) => state.ui.locale);
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);
  const articlesById = useAppSelector((state) => state.news.articlesById);
  const country = useAppSelector((state) => state.news.country);
  const hydrated = useAppSelector((state) => state.ui.hydrated);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (hydrated) localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const entries = Object.entries(articlesById).slice(-80);
    localStorage.setItem(
      ARTICLE_CACHE_KEY,
      JSON.stringify(Object.fromEntries(entries)),
    );
  }, [articlesById, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(COUNTRY_KEY, country);
  }, [country, hydrated]);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (hydrated) localStorage.setItem(LOCALE_KEY, locale);
  }, [locale, hydrated]);

  return null;
}
