import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getAllPosts, getPost } from "@/lib/blog";
import { PortableBody } from "@/components/PortableBody";

// Time-based ISR — edits to existing posts appear within ~60s (Amplify-compatible).
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
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
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              className="mt-6 w-full rounded-2xl border border-border"
            />
          )}
          {post.body && post.body.length > 0 ? (
            <div className="mt-8">
              <PortableBody value={post.body} />
            </div>
          ) : (
            <div className="mt-8 whitespace-pre-wrap text-[17px] leading-[1.7] text-fg/90">
              {post.content}
            </div>
          )}
        </article>
      </Container>
    </main>
  );
}
