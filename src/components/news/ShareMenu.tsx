"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  CheckIcon,
  CopyIcon,
  MailIcon,
  ShareIcon,
} from "@/components/icons";
import { articlePath } from "@/lib/format";
import type { Article } from "@/types/news";

type ShareMenuProps = {
  article: Article;
  excerpt?: string;
};

const shareText = (article: Article, url: string, excerpt?: string) => {
  const snippet = excerpt?.trim();
  return snippet
    ? `“${snippet}”\n\n${article.title}\n${url}`
    : `${article.title}\n${article.description || ""}\n${url}`.trim();
};

const panelPosition = (rect: DOMRect): CSSProperties => {
  const width = Math.min(240, window.innerWidth - 16);
  const margin = 8;
  let left = rect.left;
  if (left + width > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - width - margin);
  }
  if (left < margin) left = margin;
  const openUp = rect.top > 280;
  return openUp
    ? { position: "fixed", left, bottom: window.innerHeight - rect.top + 8, width }
    : { position: "fixed", left, top: rect.bottom + 8, width };
};

export default function ShareMenu({ article, excerpt }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url =
    typeof window === "undefined"
      ? articlePath(article)
      : `${window.location.origin}${articlePath(article)}`;
  const text = shareText(article, url, excerpt);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPanelStyle(panelPosition(rect));
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  const copy = async (value: string, kind: "link" | "text") => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text, url });
      setOpen(false);
    }
  };

  const panel = open ? (
    <div
      ref={panelRef}
      className="share-panel"
      role="menu"
      style={panelStyle}
    >
      <p className="share-title">שיתוף הכתבה</p>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button type="button" onClick={nativeShare}>
          <ShareIcon /> שיתוף מהיר
        </button>
      )}
      <button type="button" onClick={() => copy(url, "link")}>
        {copied === "link" ? <CheckIcon /> : <CopyIcon />}
        {copied === "link" ? "הקישור הועתק" : "העתקת קישור"}
      </button>
      <button type="button" onClick={() => copy(text, "text")}>
        {copied === "text" ? <CheckIcon /> : <CopyIcon />}
        {copied === "text" ? "הטקסט הועתק" : "העתקת כותרת וקישור"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        X / Twitter
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(text)}`}
        onClick={(event) => event.stopPropagation()}
      >
        <MailIcon /> אימייל
      </a>
    </div>
  ) : null;

  return (
    <div className="share-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-label="שיתוף כתבה"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const rect = buttonRef.current?.getBoundingClientRect();
          if (!open && rect) setPanelStyle(panelPosition(rect));
          setOpen((value) => !value);
        }}
      >
        <ShareIcon />
      </button>
      {mounted && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
