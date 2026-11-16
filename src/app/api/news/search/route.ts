import { NextRequest, NextResponse } from "next/server";
import { searchNews } from "@/lib/server/gnews";

export const revalidate = 300;

const parsePage = (value: string | null) =>
  Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const country = request.nextUrl.searchParams.get("country") ?? "il";
  const page = parsePage(request.nextUrl.searchParams.get("page"));

  if (!query) {
    return NextResponse.json(
      { success: false, message: "Missing search query" },
      { status: 400 },
    );
  }

  try {
    const newsData = await searchNews(query, country, page);
    return NextResponse.json(newsData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("חריגה") ? 429 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
