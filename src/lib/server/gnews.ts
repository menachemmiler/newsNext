import { GNEWS_MAX_ARTICLES, GNEWS_PAGE_SIZE } from "@/lib/constants";
import type { Article, NewsResponse, Source } from "@/types/news";

const COUNTRY_LANG: Record<string, string> = {
  il: "he",
  us: "en",
  gb: "en",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
  ru: "ru",
  ar: "es",
  br: "pt",
  pt: "pt",
  in: "en",
  au: "en",
  ca: "en",
  jp: "ja",
  kr: "ko",
  cn: "zh",
  tr: "tr",
  ua: "uk",
  eg: "ar",
  sa: "ar",
  ae: "ar",
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map<string, { expires: number; data: NewsResponse }>();

let activeKeyIndex = 0;

const articleIdFromUrl = (url: string): string => {
  let hash = 5381;
  for (let i = 0; i < url.length; i += 1) {
    hash = (hash * 33) ^ url.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
};

const getApiKeys = (): string[] =>
  [
    process.env.GNEWS_API_KEY,
    process.env.GNEWS_API_KEY_FALLBACK,
  ].filter((key): key is string => Boolean(key));

const langForCountry = (country?: string): string => {
  if (!country) return "he";
  return COUNTRY_LANG[country.toLowerCase()] || "he";
};

const normalizeArticle = (article: Article): Article => ({
  ...article,
  id: article.id || articleIdFromUrl(article.url),
  title: article.title || "",
  description: article.description || "",
  content: article.content || "",
  image: article.image || "",
  publishedAt: article.publishedAt || new Date().toISOString(),
  source: article.source || ({ name: "Unknown", url: article.url } as Source),
});

const articleDedupeKeys = (article: Article): string[] => {
  const keys = [article.id, article.url];
  try {
    keys.push(new URL(article.url).pathname.replace(/\/$/, "").toLowerCase());
  } catch {
    /* ignore invalid urls */
  }
  return keys.filter(Boolean);
};

const dedupeArticles = (articles: Article[]): Article[] => {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const keys = articleDedupeKeys(article);
    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
};

const normalizeResponse = (data: NewsResponse, page = 1): NewsResponse => {
  const rawCount = (data.articles || []).length;
  const articles = dedupeArticles((data.articles || []).map(normalizeArticle));
  const total = data.totalArticles || 0;
  return {
    totalArticles: total,
    articles,
    page,
    hasMore:
      rawCount >= GNEWS_PAGE_SIZE &&
      (total === 0 || page * GNEWS_PAGE_SIZE < Math.min(total, GNEWS_MAX_ARTICLES)),
  };
};

class QuotaError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
  }
}

const requestGnews = async (endpoint: string, params: Record<string, string>) => {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error("API Key is missing in environment variables");
  }

  const orderedKeys = [
    ...keys.slice(activeKeyIndex),
    ...keys.slice(0, activeKeyIndex),
  ];

  let lastError: Error | null = null;

  for (const key of orderedKeys) {
    const url = new URL(`https://gnews.io/api/v4/${endpoint}`);
    Object.entries(params).forEach(([name, value]) => {
      url.searchParams.set(name, value);
    });
    url.searchParams.set("apikey", key);

    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: 300 },
      });
      if (response.status === 429 || response.status === 401 || response.status === 403) {
        lastError = new QuotaError(
          "חריגה ממכסת הבקשות ל-GNews. נסו שוב בעוד כמה דקות.",
        );
        continue;
      }

      const data = (await response.json()) as NewsResponse & {
        errors?: string[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.errors?.[0] || data.message || "GNews error");
      }

      activeKeyIndex = keys.indexOf(key);
      const page = Number.parseInt(params.page || "1", 10) || 1;
      return normalizeResponse(data, page);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("GNews error");
      if (!(lastError instanceof QuotaError)) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new QuotaError("חריגה ממכסת הבקשות ל-GNews.");
};

const clampPage = (page: number) =>
  Math.min(
    Math.max(1, page),
    Math.floor(GNEWS_MAX_ARTICLES / GNEWS_PAGE_SIZE),
  );

const withCache = async (key: string, loader: () => Promise<NewsResponse>) => {
  const cached = responseCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  const data = await loader();
  responseCache.set(key, { expires: Date.now() + CACHE_TTL_MS, data });
  return data;
};

export const fetchTopHeadlines = async (
  country?: string,
  category?: string,
  query?: string,
  page = 1,
): Promise<NewsResponse> => {
  const selectedCountry = country || "il";
  const selectedCategory = category || "general";
  const selectedPage = clampPage(page);
  const cacheKey = `headlines:${selectedCountry}:${selectedCategory}:${query || ""}:${selectedPage}:media-dedupe`;

  return withCache(cacheKey, () =>
    requestGnews("top-headlines", {
      country: selectedCountry,
      category: selectedCategory,
      lang: langForCountry(selectedCountry),
      max: String(GNEWS_PAGE_SIZE),
      page: String(selectedPage),
      nullable: "description,content",
      ...(query ? { q: query } : {}),
    }),
  );
};

export const searchNews = async (
  query: string,
  country?: string,
  page = 1,
): Promise<NewsResponse> => {
  const selectedCountry = country || "il";
  const selectedPage = clampPage(page);
  const cacheKey = `search:${selectedCountry}:${query}:${selectedPage}:media-dedupe`;

  return withCache(cacheKey, () =>
    requestGnews("search", {
      q: query,
      country: selectedCountry,
      lang: langForCountry(selectedCountry),
      max: String(GNEWS_PAGE_SIZE),
      page: String(selectedPage),
      sortby: "relevance",
      in: "title,description,content",
      nullable: "description,content",
    }),
  );
};
