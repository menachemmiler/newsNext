"use client";

import { useEffect, useState } from "react";
import { CopyIcon, ShareIcon } from "@/components/icons";
import { articlePath } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Article } from "@/types/news";

export default function SelectionShare({ article }: { article: Article }) {
  const { t } = useT();
  const [selection, setSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onMouseUp = () => {
      const selected = window.getSelection();
      const text = selected?.toString().trim() ?? "";
      if (!selected || !text || text.length < 8 || selected.rangeCount === 0) {
        setSelection(null);
        return;
      }
      const rect = selected.getRangeAt(0).getBoundingClientRect();
      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
      });
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, []);

  if (!selection) return null;

  const url =
    typeof window === "undefined"
      ? articlePath(article)
      : `${window.location.origin}${articlePath(article)}`;
  const payload = `“${selection.text}”\n\n${article.title}\n${url}`;

  return (
    <div
      className="selection-share"
      style={{ left: selection.x, top: selection.y - 52 }}
    >
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(payload);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
      >
        <CopyIcon /> {copied ? t("copied") : t("copySnippet")}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(payload)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShareIcon /> {t("share")}
      </a>
    </div>
  );
}
