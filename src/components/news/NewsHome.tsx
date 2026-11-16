"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import BreakingTicker from "@/components/layout/BreakingTicker";
import ArticleCard from "@/components/news/ArticleCard";
import InfiniteSentinel from "@/components/news/InfiniteSentinel";
import { categoryLabel } from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchNews, setCategory } from "@/lib/store/newsSlice";

export default function NewsHome() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "general";
  const countryParam = searchParams.get("country");
  const {
    articles,
    status,
    error,
    country,
    category,
    page,
    hasMore,
    loadingMore,
  } = useAppSelector((state) => state.news);

  const activeCountry = countryParam || country;
  const activeCategory = categoryParam || category;

  useEffect(() => {
    dispatch(setCategory(activeCategory));
    dispatch(
      fetchNews({ country: activeCountry, category: activeCategory, page: 1 }),
    );
  }, [activeCountry, activeCategory, dispatch]);

  const fetchingMore = useRef(false);

  const loadMore = useCallback(() => {
    if (
      fetchingMore.current ||
      status !== "succeeded" ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }
    fetchingMore.current = true;
    void dispatch(
      fetchNews({
        country: activeCountry,
        category: activeCategory,
        page: page + 1,
      }),
    ).finally(() => {
      fetchingMore.current = false;
    });
  }, [
    status,
    loadingMore,
    hasMore,
    dispatch,
    activeCountry,
    activeCategory,
    page,
  ]);

  const hero = articles[0];
  const featured = articles.slice(1, 3);
  const rest = articles.slice(3);
  const showFeed = Boolean(hero) && status !== "loading" && status !== "failed";

  return (
    <div className="home-page">
      <BreakingTicker />
      <div className="section-kicker">
        <span>מהדורה דיגיטלית</span>
        <h1>{categoryLabel(activeCategory)}</h1>
      </div>

      {(status === "loading" || status === "idle") && (
        <div className="skeleton-home" aria-hidden="true">
          <div className="skeleton hero-skel" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {status === "failed" && articles.length === 0 && (
        <div className="state-card">
          <h2>לא הצלחנו לטעון את החדשות</h2>
          <p>{error}</p>
        </div>
      )}

      {status === "succeeded" && articles.length === 0 && (
        <div className="state-card">
          <h2>אין כתבות בקטגוריה הזו כרגע</h2>
          <p>נסו מדינה או נושא אחר.</p>
        </div>
      )}

      {showFeed && hero && (
        <>
          <section className="lead-grid">
            <ArticleCard article={hero} variant="hero" />
            <div className="featured-stack">
              {featured.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="featured"
                />
              ))}
            </div>
          </section>
          <section className="story-grid">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
          <InfiniteSentinel
            onLoadMore={loadMore}
            hasMore={hasMore}
            loading={loadingMore}
            error={status === "succeeded" ? error : null}
          />
        </>
      )}
    </div>
  );
}
