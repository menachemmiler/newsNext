"use client";

import ArticleCard from "@/components/news/ArticleCard";
import { useT } from "@/lib/i18n";
import { useAppSelector } from "@/lib/store/hooks";

export default function SavedPage() {
  const { t } = useT();
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);

  return (
    <div className="home-page">
      <div className="section-kicker">
        <span>{t("myReading")}</span>
        <h1>{t("savedTitle")}</h1>
      </div>
      {bookmarks.length === 0 ? (
        <div className="state-card">
          <h2>{t("noSaved")}</h2>
          <p>{t("noSavedHint")}</p>
        </div>
      ) : (
        <section className="story-grid">
          {bookmarks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      )}
    </div>
  );
}
