"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ArticleCard from "@/components/news/ArticleCard";
import InfiniteSentinel from "@/components/news/InfiniteSentinel";
import SearchBox from "@/components/news/SearchBox";
import { useT } from "@/lib/i18n";
import { filterArticles, uniqueArticles } from "@/lib/localSearch";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { searchNews } from "@/lib/store/newsSlice";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { t } = useT();
  const q = searchParams.get("q") ?? "";
  const dispatch = useAppDispatch();
  const {
    searchResults,
    searchStatus,
    error,
    country,
    articles,
    articlesById,
    searchPage,
    searchHasMore,
    searchLoadingMore,
  } = useAppSelector((state) => state.news);
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);

  const localMatches = useMemo(() => {
    const pool = uniqueArticles([
      ...articles,
      ...bookmarks,
      ...Object.values(articlesById),
    ]);
    return filterArticles(pool, q);
  }, [articles, bookmarks, articlesById, q]);

  useEffect(() => {
    const query = q.trim();
    if (!query) return;
    dispatch(searchNews({ query, country, page: 1 }));
  }, [q, country, dispatch]);

  const fetchingMore = useRef(false);

  const loadMore = useCallback(() => {
    const query = q.trim();
    if (
      fetchingMore.current ||
      !query ||
      searchStatus !== "succeeded" ||
      searchLoadingMore ||
      !searchHasMore
    ) {
      return;
    }
    fetchingMore.current = true;
    void dispatch(
      searchNews({ query, country, page: searchPage + 1 }),
    ).finally(() => {
      fetchingMore.current = false;
    });
  }, [
    q,
    searchStatus,
    searchLoadingMore,
    searchHasMore,
    dispatch,
    country,
    searchPage,
  ]);

  const displayed = uniqueArticles(
    searchStatus === "succeeded"
      ? [...searchResults, ...localMatches]
      : [...localMatches, ...searchResults],
  );

  return (
    <div className="home-page">
      <div className="section-kicker">
        <span>{t("searchKicker")}</span>
        <h1>{q ? t("resultsFor", { q }) : t("searchTitle")}</h1>
      </div>
      <SearchBox initialQuery={q} className="is-open page-search" />
      {searchStatus === "loading" && displayed.length === 0 && (
        <div className="skeleton-home">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}
      {searchStatus === "failed" && displayed.length === 0 && (
        <div className="state-card">
          <h2>{t("searchFailed")}</h2>
          <p>{error}</p>
        </div>
      )}
      {searchStatus === "succeeded" && displayed.length === 0 && (
        <div className="state-card">
          <h2>{t("noResults")}</h2>
          <p>{t("tryOtherQuery")}</p>
        </div>
      )}
      {displayed.length > 0 && (
        <>
          <section className="story-grid">
            {displayed.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
          <InfiniteSentinel
            onLoadMore={loadMore}
            hasMore={searchHasMore}
            loading={searchLoadingMore}
            error={searchStatus === "succeeded" ? error : null}
          />
        </>
      )}
    </div>
  );
}
