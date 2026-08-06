import { blogEmptyStateNote, blogPosts } from "../posts";
import { PageShell } from "../components/PageShell";

export function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title="Notes on dental cost transparency."
      intro="Longer-form writing about reading estimates, navigating dental costs, and how the guide is built."
      variant="editorial"
    >
      <section className="editorial-board">
        <div>
          <p className="eyebrow">Editorial queue</p>
          <h2>Planned writing should help people read estimates without pretending to be medical advice.</h2>
        </div>
        <ul>
          <li>How to compare two dental quotes without getting lost in jargon.</li>
          <li>Why county-level ranges are useful but never the final word.</li>
          <li>What to ask before paying cash for common dental procedures.</li>
        </ul>
      </section>
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
