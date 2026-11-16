export interface Source {
  name: string;
  url: string;
  country?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: Source;
}

export interface NewsResponse {
  totalArticles: number;
  articles: Article[];
  page?: number;
  hasMore?: boolean;
}

export type LoadStatus = "idle" | "loading" | "succeeded" | "failed";
export type ThemeMode = "light" | "dark";
