import { Suspense } from "react";
import SearchPage from "@/components/news/SearchPage";

export default function Search() {
  return (
    <Suspense fallback={<div className="state-card">טוען חיפוש...</div>}>
      <SearchPage />
    </Suspense>
  );
}
