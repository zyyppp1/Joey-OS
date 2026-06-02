import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { posts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="py-24 sm:py-32">
      <Container>
        <Link href="/blog" className="font-mono text-sm text-muted hover:text-fg">
          ← all posts
        </Link>
        <article className="mt-8">
          <p className="font-mono text-xs text-muted">{post.date}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-8 whitespace-pre-wrap text-[17px] leading-[1.7] text-fg/90">
            {post.content}
          </div>
        </article>
      </Container>
    </main>
  );
}
