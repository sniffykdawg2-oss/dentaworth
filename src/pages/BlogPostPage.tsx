import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { blogPosts, formatPostDate } from "../posts";
import { handleLinkClick } from "../nav";
import { ReadingProgress } from "../motion/ReadingProgress";

export function BlogPostPage({ navigate }: { navigate: (href: string) => void }) {
  const articleRef = useRef<HTMLElement>(null);
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1];
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    return (
      <PageShell eyebrow="Blog" title="That article is not here." intro="The article may have moved." variant="editorial">
        <div>
          <a className="button primary" href="/blog" onClick={(event) => handleLinkClick(event, "/blog", navigate)}>
            <ArrowLeft size={18} aria-hidden="true" /> Back to the blog
          </a>
        </div>
      </PageShell>
    );
  }

  const wordCount = post.body.join(" ").split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <PageShell eyebrow="Blog article" title={post.title} intro={post.summary} variant="editorial" heroImage={post.image || "/images/mother-daughter-smile.jpg"}>
      <ReadingProgress targetRef={articleRef} />
      <article className="blog-article" ref={articleRef}>
        <header className="blog-article-header" data-reveal="up">
          <div className="blog-article-meta">
            <span>{formatPostDate(post.date)}</span>
            <span>{readingMinutes} minute read</span>
          </div>
        </header>
        <div className="blog-article-body" data-reveal="up">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <a className="button secondary" href="/blog" onClick={(event) => handleLinkClick(event, "/blog", navigate)}>
          <ArrowLeft size={18} aria-hidden="true" /> Back to the blog
        </a>
      </article>
    </PageShell>
  );
}
