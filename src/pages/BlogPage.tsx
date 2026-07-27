import { blogEmptyStateNote, blogPosts } from "../posts";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

export function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title="Notes on dental cost transparency."
      intro="Longer-form writing about reading estimates, navigating dental costs, and how the guide is built."
      variant="editorial"
    >
      <BackButton />
      {blogPosts.length > 0 ? (
        <div className="post-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="post-card">
              <p className="post-date">{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>{blogEmptyStateNote}</p>
        </div>
      )}
    </PageShell>
  );
}
