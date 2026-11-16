import { Suspense } from "react";
import NewsHome from "@/components/news/NewsHome";

export default function Home() {
  return (
    <Suspense fallback={<div className="state-card">טוען מהדורה...</div>}>
      <NewsHome />
    </Suspense>
  );
}
