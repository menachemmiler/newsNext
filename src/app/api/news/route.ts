import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines } from "@/lib/server/gnews";

export const revalidate = 300;

const parsePage = (value: string | null) =>
  Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country") ?? "il";
  const category = request.nextUrl.searchParams.get("category") ?? "general";
  const q = request.nextUrl.searchParams.get("q") ?? undefined;
  const page = parsePage(request.nextUrl.searchParams.get("page"));

  try {
    const newsData = await fetchTopHeadlines(country, category, q, page);
    return NextResponse.json(newsData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("חריגה") ? 429 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
