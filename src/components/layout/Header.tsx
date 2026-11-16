"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { BookmarkIcon, MoonIcon, SunIcon } from "@/components/icons";
import CategoryNav from "@/components/layout/CategoryNav";
import SearchBox from "@/components/news/SearchBox";
import { COUNTRIES } from "@/lib/constants";
import { todayLabel } from "@/lib/format";
import { countryKey, useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCountry } from "@/lib/store/newsSlice";
import { setLocale, toggleTheme } from "@/lib/store/uiSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { t, dateLocale, locale } = useT();
  const theme = useAppSelector((state) => state.ui.theme);
  const country = useAppSelector((state) => state.news.country);
  const category = useAppSelector((state) => state.news.category);
  const savedCount = useAppSelector((state) => state.ui.bookmarks.length);

  return (
    <header className="site-header">
      <div className="masthead">
        <p className="masthead-date">{todayLabel(dateLocale)}</p>
        <Link href="/" className="wordmark">
          <span className="wordmark-kicker">{t("siteKicker")}</span>
          <span className="wordmark-title">{t("siteName")}</span>
          <span className="wordmark-tag">{t("siteTagline")}</span>
        </Link>
        <div className="masthead-actions">
          <button
            type="button"
            className="icon-btn lang-toggle"
            aria-label={t("selectLanguage")}
            onClick={() => dispatch(setLocale(locale === "he" ? "en" : "he"))}
          >
            {locale === "he" ? "EN" : "עב"}
          </button>
          <select
            className="country-select"
            value={country}
            onChange={(event) => {
              const nextCountry = event.target.value;
              dispatch(setCountry(nextCountry));
              if (pathname === "/") {
                router.push(`/?category=${category}&country=${nextCountry}`);
              }
            }}
            aria-label={t("selectCountry")}
          >
            {COUNTRIES.map((item) => (
              <option key={item.id} value={item.id}>
                {t(countryKey(item.id))}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            aria-label={theme === "dark" ? t("themeToLight") : t("themeToDark")}
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/saved" className="icon-btn saved-link" aria-label={t("savedAria")}>
            <BookmarkIcon />
            {savedCount > 0 && <span className="badge">{savedCount}</span>}
          </Link>
        </div>
      </div>
      <SearchBox className="header-search" />
      <Suspense fallback={null}>
        <CategoryNav />
      </Suspense>
    </header>
  );
}
