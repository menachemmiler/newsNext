import type { Metadata } from "next";
import ArticleView from "@/components/news/ArticleView";
import { SITE_NAME } from "@/lib/constants";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { title } = await searchParams;
  return {
    title: title ? `${title}` : `כתבה | ${SITE_NAME}`,
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { title } = await searchParams;
  return <ArticleView id={id} titleHint={title} />;
}
