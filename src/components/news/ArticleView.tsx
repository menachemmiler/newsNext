"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BookmarkButton from "@/components/news/BookmarkButton";
import SelectionShare from "@/components/news/SelectionShare";
import ShareMenu from "@/components/news/ShareMenu";
import ArticleCard from "@/components/news/ArticleCard";
import {
  ExternalIcon,
  PrinterIcon,
  TypeIcon,
} from "@/components/icons";
import {
  categoryLabel,
  cleanContent,
  formatDateTime,
  readingMinutes,
} from "@/lib/format";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { cacheArticle, searchNews } from "@/lib/store/newsSlice";
import { setFontScale } from "@/lib/store/uiSlice";

export default function ArticleView({
  id,
  titleHint,
}: {
  id: string;
  titleHint?: string;
}) {
  const dispatch = useAppDispatch();
  const decodedId = decodeURIComponent(id);
  const articles = useAppSelector((state) => state.news.articles);
  const searchResults = useAppSelector((state) => state.news.searchResults);
  const articlesById = useAppSelector((state) => state.news.articlesById);
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);
  const fontScale = useAppSelector((state) => state.ui.fontScale);
  const country = useAppSelector((state) => state.news.country);
  const category = useAppSelector((state) => state.news.category);
  const [progress, setProgress] = useState(0);

  const article = useMemo(() => {
    return (
      articlesById[decodedId] ||
      articles.find((item) => item.id === decodedId) ||
      searchResults.find((item) => item.id === decodedId) ||
      bookmarks.find((item) => item.id === decodedId)
    );
  }, [articlesById, articles, searchResults, bookmarks, decodedId]);

  useEffect(() => {
    if (article) {
      dispatch(cacheArticle(article));
      return;
    }
    if (titleHint) {
      dispatch(searchNews({ query: titleHint, country }));
    }
  }, [article?.id, titleHint, country, dispatch]);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const related = articles
    .filter((item) => item.id !== decodedId)
    .slice(0, 4);

  if (!article) {
    return (
      <div className="state-card">
        <h2>מחפשים את הכתבה...</h2>
        <p>
          אם הגעתם מקישור משותף, ננסה לאתר אותה לפי הכותרת. אפשר גם לחזור
          לעמוד הראשי.
        </p>
        <Link href="/" className="text-link">
          חזרה לראשי
        </Link>
      </div>
    );
  }

  const body = cleanContent(article.content || article.description || "");

  return (
    <article className="article-page">
      <div className="read-progress" style={{ width: `${progress}%` }} />
      <SelectionShare article={article} />
      <nav className="crumbs">
        <Link href="/">ראשי</Link>
        <span>/</span>
        <Link href={`/?category=${category}`}>{categoryLabel(category)}</Link>
      </nav>
      <p className="story-meta">
        <span>{article.source?.name}</span>
        <span className="dot" />
        <span>{formatDateTime(article.publishedAt)}</span>
        <span className="dot" />
        <span>{readingMinutes(article)} דק׳ קריאה</span>
      </p>
      <h1>{article.title}</h1>
      {article.description && (
        <p className="article-dek">{article.description}</p>
      )}
      <div className="article-toolbar">
        <div className="toolbar-cluster">
          <BookmarkButton article={article} />
          <ShareMenu article={article} />
          <button
            type="button"
            className="icon-btn"
            aria-label="הדפסה"
            onClick={() => window.print()}
          >
            <PrinterIcon />
          </button>
          <a
            className="icon-btn"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="לכתבה המקורית"
          >
            <ExternalIcon />
          </a>
        </div>
        <div className="toolbar-cluster">
          <TypeIcon />
          <button
            type="button"
            className="text-btn"
            onClick={() => dispatch(setFontScale(fontScale - 0.08))}
          >
            א-
          </button>
          <button
            type="button"
            className="text-btn"
            onClick={() => dispatch(setFontScale(fontScale + 0.08))}
          >
            א+
          </button>
        </div>
      </div>
      {article.image && (
        <figure className="article-hero">
          <img src={article.image} alt="" />
          <figcaption>{article.source?.name}</figcaption>
        </figure>
      )}
      <div className="article-body" style={{ fontSize: `${fontScale}rem` }}>
        {body.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="source-note">
          הטקסט המלא ממשיך אצל המקור.{" "}
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            לקריאה ב-{article.source?.name || "אתר הכתבה"}
          </a>
        </p>
      </div>
      {related.length > 0 && (
        <section className="related">
          <h2>עוד בנושא</h2>
          <div className="story-grid related-grid">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
