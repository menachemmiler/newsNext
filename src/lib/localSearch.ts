import type { Article } from "@/types/news";

export const filterArticles = (articles: Article[], query: string): Article[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return articles.filter((article) => {
    const haystack = [
      article.title,
      article.description,
      article.content,
      article.source?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
};

export const uniqueArticles = (articles: Article[]): Article[] => {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const keys = [article.id, article.url];
    try {
      keys.push(new URL(article.url).pathname.replace(/\/$/, "").toLowerCase());
    } catch {
      /* ignore invalid urls */
    }
    if (keys.some((key) => key && seen.has(key))) return false;
    keys.forEach((key) => {
      if (key) seen.add(key);
    });
    return true;
  });
};
