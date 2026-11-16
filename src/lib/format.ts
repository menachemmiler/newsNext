import type { Article } from "@/types/news";

export const articleIdFromUrl = (url: string): string => {
  let hash = 5381;
  for (let i = 0; i < url.length; i += 1) {
    hash = (hash * 33) ^ url.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
};

export const ensureArticleId = (article: Article): Article => ({
  ...article,
  id: article.id || articleIdFromUrl(article.url),
});

export const timeAgo = (iso: string, locale = "he-IL"): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (mins < 1) return rtf.format(0, "second");
  if (mins < 60) return rtf.format(-mins, "minute");
  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 7) return rtf.format(-days, "day");
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
};

export const formatDateTime = (iso: string, locale = "he-IL"): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const todayLabel = (locale = "he-IL"): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

export const readingMinutes = (article: Article): number => {
  const text = `${article.title} ${article.description} ${article.content}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
};

export const cleanContent = (content: string): string =>
  content.replace(/\s*\[\d+\s*chars\]\s*$/i, "").trim();

export const articlePath = (article: Article): string =>
  `/article/${encodeURIComponent(article.id)}?title=${encodeURIComponent(article.title)}`;

export const categoryLabel = (id: string): string => {
  const map: Record<string, string> = {
    general: "ראשי",
    nation: "מקומי",
    world: "עולם",
    business: "כלכלה",
    technology: "טכנולוגיה",
    entertainment: "תרבות",
    sports: "ספורט",
    science: "מדע",
    health: "בריאות",
  };
  return map[id] ?? id;
};
