export const CATEGORIES = [
  { id: "general", label: "ראשי" },
  { id: "nation", label: "מקומי" },
  { id: "world", label: "עולם" },
  { id: "business", label: "כלכלה" },
  { id: "technology", label: "טכנולוגיה" },
  { id: "entertainment", label: "תרבות" },
  { id: "sports", label: "ספורט" },
  { id: "science", label: "מדע" },
  { id: "health", label: "בריאות" },
] as const;

export const COUNTRIES = [
  { id: "il", label: "ישראל" },
  { id: "us", label: "ארצות הברית" },
  { id: "gb", label: "בריטניה" },
  { id: "fr", label: "צרפת" },
  { id: "de", label: "גרמניה" },
] as const;

export const THEME_KEY = "now-theme";
export const BOOKMARKS_KEY = "now-bookmarks";
export const ARTICLE_CACHE_KEY = "now-article-cache";
export const COUNTRY_KEY = "now-country";
export const LOCALE_KEY = "now-locale";

export const SITE_NAME = "עכשיו";
export const SITE_KICKER = "מכל מקום";
export const SITE_TAGLINE = "חדשות מכל האתרים, במקום אחד";

export const getSiteUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (host) {
    return `https://${host.replace(/^https?:\/\//, "")}`;
  }

  return "http://localhost:3000";
};

export const GNEWS_PAGE_SIZE = 10;
export const GNEWS_MAX_ARTICLES = 1000;
