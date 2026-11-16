"use client";

import { BookmarkFilledIcon, BookmarkIcon } from "@/components/icons";
import { useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleBookmark } from "@/lib/store/uiSlice";
import type { Article } from "@/types/news";

export default function BookmarkButton({ article }: { article: Article }) {
  const dispatch = useAppDispatch();
  const { t } = useT();
  const saved = useAppSelector((state) =>
    state.ui.bookmarks.some((item) => item.id === article.id),
  );

  return (
    <button
      type="button"
      className={`icon-btn ${saved ? "is-active" : ""}`}
      aria-label={saved ? t("unbookmark") : t("bookmark")}
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
