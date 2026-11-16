"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { articlePath } from "@/lib/format";
import { filterArticles, uniqueArticles } from "@/lib/localSearch";
import { useAppSelector } from "@/lib/store/hooks";

type SearchBoxProps = {
  initialQuery?: string;
  className?: string;
};

export default function SearchBox({
  initialQuery = "",
  className = "",
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const articles = useAppSelector((state) => state.news.articles);
  const searchResults = useAppSelector((state) => state.news.searchResults);
  const articlesById = useAppSelector((state) => state.news.articlesById);
  const bookmarks = useAppSelector((state) => state.ui.bookmarks);

  const suggestions = useMemo(() => {
    const pool = uniqueArticles([
      ...articles,
      ...searchResults,
      ...bookmarks,
      ...Object.values(articlesById),
    ]);
    return filterArticles(pool, query).slice(0, 7);
  }, [articles, searchResults, bookmarks, articlesById, query]);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form
      className={`search-form ${className}`}
      onSubmit={onSearch}
      autoComplete="off"
    >
      <SearchIcon />
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        placeholder="חיפוש כתבה, נושא או מקור..."
        aria-label="חיפוש חדשות"
        aria-autocomplete="list"
      />
      <button type="submit">חיפוש</button>
      {open && query.trim().length > 1 && suggestions.length > 0 && (
        <div className="search-suggest" role="listbox">
          {suggestions.map((article) => (
            <Link
              key={article.id}
              href={articlePath(article)}
              className="search-suggest-item"
              onMouseDown={(event) => event.preventDefault()}
            >
              <strong>{article.title}</strong>
              <span>{article.source?.name}</span>
            </Link>
          ))}
          <p className="search-suggest-hint">
            השלמה מכתבות שכבר נטענו. חיפוש מלא ירוץ מול ה-API
          </p>
        </div>
      )}
    </form>
  );
}
