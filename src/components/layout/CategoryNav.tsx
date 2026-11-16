"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { useAppSelector } from "@/lib/store/hooks";

type CategoryNavProps = {
  className?: string;
  onNavigate?: () => void;
};

export default function CategoryNav({
  className = "",
  onNavigate,
}: CategoryNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country = useAppSelector((state) => state.news.country);
  const active =
    pathname === "/" ? (searchParams.get("category") ?? "general") : "";

  return (
    <nav className={`category-nav ${className}`.trim()} aria-label="קטגוריות">
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={`/?category=${category.id}&country=${country}`}
          className={active === category.id ? "is-active" : ""}
          onClick={onNavigate}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
