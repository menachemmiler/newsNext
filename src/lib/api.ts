import { ensureArticleId } from "@/lib/format";
import type { Article, NewsResponse } from "@/types/news";

const parseNews = async (response: Response): Promise<NewsResponse> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "שגיאה בטעינת החדשות");
  }
  const articles: Article[] = (data.articles ?? []).map(ensureArticleId);
  return {
    totalArticles: data.totalArticles ?? articles.length,
    articles,
    page: data.page ?? 1,
    hasMore: Boolean(data.hasMore),
  };
};

export const fetchHeadlines = async (
  country: string,
  category: string,
  page = 1,
): Promise<NewsResponse> => {
  const params = new URLSearchParams({
    country,
    category,
    page: String(page),
  });
  const response = await fetch(`/api/news?${params.toString()}`);
  return parseNews(response);
};

export const searchNewsApi = async (
  query: string,
  country: string,
  page = 1,
): Promise<NewsResponse> => {
  const params = new URLSearchParams({
    q: query,
    country,
    page: String(page),
  });
  const response = await fetch(`/api/news/search?${params.toString()}`);
  return parseNews(response);
};
