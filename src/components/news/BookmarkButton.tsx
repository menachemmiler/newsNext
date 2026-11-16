"use client";

import { BookmarkFilledIcon, BookmarkIcon } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleBookmark } from "@/lib/store/uiSlice";
import type { Article } from "@/types/news";

export default function BookmarkButton({ article }: { article: Article }) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) =>
    state.ui.bookmarks.some((item) => item.id === article.id),
  );

  return (
    <button
      type="button"
      className={`icon-btn ${saved ? "is-active" : ""}`}
      aria-label={saved ? "הסרה מהשמורים" : "שמירת כתבה"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(toggleBookmark(article));
      }}
    >
      {saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}
    </button>
  );
}
