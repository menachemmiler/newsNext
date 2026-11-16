"use client";

import Link from "next/link";
import { articlePath } from "@/lib/format";
import { useAppSelector } from "@/lib/store/hooks";

export default function BreakingTicker() {
  const articles = useAppSelector((state) => state.news.articles);
  if (articles.length === 0) return null;

  const items = [...articles, ...articles];

  return (
    <div className="ticker" aria-label="כותרות מתחלפות">
      <span className="ticker-label">מבזקים</span>
      <div className="ticker-track">
        <div className="ticker-move">
          {items.map((article, index) => (
            <Link key={`${article.id}-${index}`} href={articlePath(article)}>
              <span className="ticker-dot" />
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
