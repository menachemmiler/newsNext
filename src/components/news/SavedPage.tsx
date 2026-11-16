"use client";

import ArticleCard from "@/components/news/ArticleCard";
import { useAppSelector } from "@/lib/store/hooks";

export default function SavedPage() {
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);

  return (
    <div className="home-page">
      <div className="section-kicker">
        <span>הקריאה שלי</span>
        <h1>כתבות שמורות</h1>
      </div>
      {bookmarks.length === 0 ? (
        <div className="state-card">
          <h2>עדיין אין שמורים</h2>
          <p>לחצו על הסימנייה בכל כתבה כדי לשמור אותה לקריאה מאוחר יותר.</p>
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
