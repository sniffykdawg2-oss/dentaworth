import { newsPosts } from "../posts";
import { PageShell } from "../components/PageShell";

export function NewsPage() {
  return (
    <PageShell
      eyebrow="News and features"
      title="What's new at DentaWorth."
      intro="Product updates, new counties, and feature launches, posted as they happen."
      variant="editorial"
      heroImage="/images/page-hero-family-home.png"
    >
      <section className="news-timeline-intro">
        <p className="eyebrow">Product log</p>
        <h2>Launch notes, feature updates, and coverage changes will live here.</h2>
        <p>
          The news page is intentionally factual: product updates only, no pretend press, no
          invented awards, and no filler announcements.
        </p>
      </section>
      <section className="release-principles" aria-labelledby="release-principles-heading">
        <p className="eyebrow">Release notes</p>
        <h2 id="release-principles-heading">Updates stay factual and specific.</h2>
        <div>
          <span>Feature changes</span>
          <span>Coverage changes</span>
          <span>Data workflow changes</span>
          <span>Launch notes</span>
        </div>
      </section>
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
