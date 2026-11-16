"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { BookmarkIcon, MoonIcon, SunIcon } from "@/components/icons";
import CategoryNav from "@/components/layout/CategoryNav";
import SearchBox from "@/components/news/SearchBox";
import { COUNTRIES, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { todayLabel } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setCountry } from "@/lib/store/newsSlice";
import { toggleTheme } from "@/lib/store/uiSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useAppSelector((state) => state.ui.theme);
  const country = useAppSelector((state) => state.news.country);
  const category = useAppSelector((state) => state.news.category);
  const savedCount = useAppSelector((state) => state.ui.bookmarks.length);

  return (
    <header className="site-header">
      <div className="masthead">
        <p className="masthead-date">{todayLabel()}</p>
        <Link href="/" className="wordmark">
          <span className="wordmark-kicker">NOW</span>
          <span className="wordmark-title">{SITE_NAME}</span>
          <span className="wordmark-tag">{SITE_TAGLINE}</span>
        </Link>
        <div className="masthead-actions">
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
            aria-label="בחירת מדינה"
          >
            {COUNTRIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="/saved" className="icon-btn saved-link" aria-label="כתבות שמורות">
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
