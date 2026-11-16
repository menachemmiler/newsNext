"use client";

import { useEffect, useRef } from "react";

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
    return <p className="load-sentinel is-end">הגעתם לסוף העדכון</p>;
  }

  return (
    <div className="load-sentinel" aria-live="polite">
      {error ? (
        <button type="button" className="text-btn" onClick={onLoadMore}>
          {error} — נסו שוב
        </button>
      ) : (
        <p>{loading ? "טוען עוד כתבות..." : "גללו למטה לעוד כתבות"}</p>
      )}
    </div>
  );
}
