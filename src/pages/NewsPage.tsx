import { newsPosts } from "../posts";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

export function NewsPage() {
  return (
    <PageShell
      eyebrow="News and features"
      title="What's new at Dentaworth."
      intro="Product updates, new counties, and feature launches, posted as they happen."
      variant="editorial"
    >
      <BackButton />
      {newsPosts.length > 0 ? (
        <div className="post-list">
          {newsPosts.map((post) => (
            <article key={post.slug} className="post-card">
              <p className="post-date">{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No updates yet</h3>
          <p>Product and feature updates will be posted here.</p>
        </div>
      )}
    </PageShell>
  );
}
