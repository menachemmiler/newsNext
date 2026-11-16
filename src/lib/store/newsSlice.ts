import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchHeadlines, searchNewsApi } from "@/lib/api";
import { ensureArticleId } from "@/lib/format";
import { uniqueArticles } from "@/lib/localSearch";
import type { Article, LoadStatus } from "@/types/news";

interface NewsState {
  articles: Article[];
  searchResults: Article[];
  articlesById: Record<string, Article>;
  totalArticles: number;
  searchTotal: number;
  status: LoadStatus;
  searchStatus: LoadStatus;
  loadingMore: boolean;
  searchLoadingMore: boolean;
  page: number;
  searchPage: number;
  hasMore: boolean;
  searchHasMore: boolean;
  error: string | null;
  country: string;
  category: string;
  query: string;
}

const initialState: NewsState = {
  articles: [],
  searchResults: [],
  articlesById: {},
  totalArticles: 0,
  searchTotal: 0,
  status: "idle",
  searchStatus: "idle",
  loadingMore: false,
  searchLoadingMore: false,
  page: 1,
  searchPage: 1,
  hasMore: false,
  searchHasMore: false,
  error: null,
  country: "il",
  category: "general",
  query: "",
};

const indexArticles = (
  state: NewsState,
  articles: Article[],
): Record<string, Article> => {
  const next = { ...state.articlesById };
  articles.forEach((article) => {
    const withId = ensureArticleId(article);
    next[withId.id] = withId;
  });
  return next;
};

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (
    {
      country,
      category,
      page = 1,
    }: { country: string; category: string; page?: number },
    { rejectWithValue },
  ) => {
    try {
      return await fetchHeadlines(country, category, page);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "שגיאה בטעינת החדשות",
      );
    }
  },
);

export const searchNews = createAsyncThunk(
  "news/searchNews",
  async (
    {
      query,
      country,
      page = 1,
    }: { query: string; country: string; page?: number },
    { rejectWithValue },
  ) => {
    try {
      return await searchNewsApi(query, country, page);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "שגיאה בחיפוש",
      );
    }
  },
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    cacheArticle(state, action: PayloadAction<Article>) {
      const article = ensureArticleId(action.payload);
      if (state.articlesById[article.id]?.id === article.id) return;
      state.articlesById[article.id] = article;
    },
    hydrateNewsCache(state, action: PayloadAction<Record<string, Article>>) {
      state.articlesById = { ...action.payload, ...state.articlesById };
    },
    setLocalSearchResults(state, action: PayloadAction<Article[]>) {
      state.searchResults = action.payload;
      state.searchStatus = "succeeded";
      state.error = null;
      state.articlesById = indexArticles(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state, action) => {
        const page = action.meta.arg.page ?? 1;
        state.error = null;
        state.country = action.meta.arg.country;
        state.category = action.meta.arg.category;
        if (page > 1) {
          state.loadingMore = true;
        } else {
          state.status = "loading";
          state.loadingMore = false;
          state.page = 1;
          state.hasMore = false;
        }
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        const { country, category, page = 1 } = action.meta.arg;
        if (country !== state.country || category !== state.category) return;
        if (page > 1 && page !== state.page + 1) return;

        state.status = "succeeded";
        state.loadingMore = false;
        state.totalArticles = action.payload.totalArticles;
        state.hasMore = Boolean(action.payload.hasMore);
        state.page = page;
        state.articles =
          page > 1
            ? uniqueArticles([...state.articles, ...action.payload.articles])
            : action.payload.articles;
        state.articlesById = indexArticles(state, action.payload.articles);
      })
      .addCase(fetchNews.rejected, (state, action) => {
        const page = action.meta.arg.page ?? 1;
        state.loadingMore = false;
        state.error = (action.payload as string) || "שגיאה בטעינת החדשות";
        if (page <= 1) {
          state.status = "failed";
        }
      })
      .addCase(searchNews.pending, (state, action) => {
        const page = action.meta.arg.page ?? 1;
        state.query = action.meta.arg.query;
        state.error = null;
        if (page > 1) {
          state.searchLoadingMore = true;
        } else {
          state.searchStatus = "loading";
          state.searchLoadingMore = false;
          state.searchResults = [];
          state.searchPage = 1;
          state.searchHasMore = false;
        }
      })
      .addCase(searchNews.fulfilled, (state, action) => {
        const { query, country, page = 1 } = action.meta.arg;
        if (query !== state.query || country !== state.country) return;
        if (page > 1 && page !== state.searchPage + 1) return;

        state.searchStatus = "succeeded";
        state.searchLoadingMore = false;
        state.searchTotal = action.payload.totalArticles;
        state.searchHasMore = Boolean(action.payload.hasMore);
        state.searchPage = page;
        state.searchResults =
          page > 1
            ? uniqueArticles([
                ...state.searchResults,
                ...action.payload.articles,
              ])
            : action.payload.articles;
        state.articlesById = indexArticles(state, action.payload.articles);
      })
      .addCase(searchNews.rejected, (state, action) => {
        const page = action.meta.arg.page ?? 1;
        state.searchLoadingMore = false;
        state.error = (action.payload as string) || "שגיאה בחיפוש";
        if (page <= 1) {
          state.searchStatus = "failed";
        }
      });
  },
});

export const {
  setCountry,
  setCategory,
  setQuery,
  cacheArticle,
  hydrateNewsCache,
  setLocalSearchResults,
} = newsSlice.actions;

export default newsSlice.reducer;
