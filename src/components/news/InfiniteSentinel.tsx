"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n";

type InfiniteSentinelProps = {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  error?: string | null;
};

const nearBottom = (threshold = 360) => {
  const position = window.scrollY + window.innerHeight;
  return position >= document.documentElement.scrollHeight - threshold;
};

const tooShortToScroll = () =>
  document.documentElement.scrollHeight <= window.innerHeight + 120;

export default function InfiniteSentinel({
  onLoadMore,
  hasMore,
  loading,
  error,
}: InfiniteSentinelProps) {
  const { t } = useT();
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!hasMore || loading || error) return;

    const tryLoad = () => {
      if (tooShortToScroll() || nearBottom()) {
        onLoadMoreRef.current();
      }
    };

    window.addEventListener("scroll", tryLoad, { passive: true });
    window.addEventListener("resize", tryLoad);
    const frame = window.requestAnimationFrame(tryLoad);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", tryLoad);
      window.removeEventListener("resize", tryLoad);
    };
  }, [hasMore, loading, error]);

  if (!hasMore && !loading && !error) {
    return <p className="load-sentinel is-end">{t("endOfFeed")}</p>;
  }

  return (
    <div className="load-sentinel" aria-live="polite">
      {error ? (
        <button type="button" className="text-btn" onClick={onLoadMore}>
          {t("retry", { error })}
        </button>
      ) : (
        <p>{loading ? t("loadingMore") : t("scrollMore")}</p>
      )}
    </div>
  );
}
