import { ArrowLeft } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { blogPosts } from "../posts";

export function BlogPostPage() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1];
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    return (
      <PageShell eyebrow="Blog" title="That article is not here." intro="The article may have moved." variant="editorial">
        <a className="button primary" href="/blog"><ArrowLeft size={18} /> Back to the blog</a>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Blog article" title={post.title} intro={post.summary} variant="editorial" heroImage="/images/mother-daughter-smile.jpg">
      <article className="blog-article">
        <header className="blog-article-header">
          <p className="eyebrow">DentaWorth field notes</p>
          <h2>{post.title}</h2>
          <div className="blog-article-meta"><span>{post.date}</span><span>6 minute read</span></div>
        </header>
        <p className="post-date">{post.date}</p>
        {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <a className="button secondary" href="/blog"><ArrowLeft size={18} /> Back to the blog</a>
      </article>
    </PageShell>
  );
}
