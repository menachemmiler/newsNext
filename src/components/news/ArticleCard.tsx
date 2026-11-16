"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookmarkButton from "@/components/news/BookmarkButton";
import ShareMenu from "@/components/news/ShareMenu";
import { ClockIcon } from "@/components/icons";
import { articlePath, readingMinutes, timeAgo } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Article } from "@/types/news";

type ArticleCardProps = {
  article: Article;
  variant?: "hero" | "featured" | "standard" | "compact";
};

export default function ArticleCard({
  article,
  variant = "standard",
}: ArticleCardProps) {
  const { t, dateLocale } = useT();
  const [showImage, setShowImage] = useState(Boolean(article.image));

  useEffect(() => {
    setShowImage(Boolean(article.image));
  }, [article.image]);

  const hasMedia = showImage && variant !== "compact";

  return (
    <article
      className={`story-card story-${variant}${hasMedia ? " has-media" : ""}`}
    >
      <Link href={articlePath(article)} className="story-link">
        {hasMedia && (
          <div className="story-media">
            <img
              src={article.image}
              alt=""
              onError={() => setShowImage(false)}
            />
          </div>
        )}
        <div className="story-body">
          <p className="story-meta">
            <span>{article.source?.name || t("source")}</span>
            <span className="dot" />
            <span>
              <ClockIcon className="inline-icon" /> {timeAgo(article.publishedAt, dateLocale)}
            </span>
            <span className="dot meta-readtime-dot" />
            <span className="meta-readtime">
              {readingMinutes(article)} {t("minRead")}
            </span>
          </p>
          <h3>{article.title}</h3>
          {variant !== "compact" && article.description && (
            <p className="story-excerpt">{article.description}</p>
          )}
        </div>
      </Link>
      <div className="story-actions">
        <BookmarkButton article={article} />
        <ShareMenu article={article} />
      </div>
    </article>
  );
}
