import { formatPostDate, newsPosts } from "../posts";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";

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
        <div>
          <MaskHeading>Launch notes, feature updates, and coverage changes will live here.</MaskHeading>
        </div>
        <p data-reveal="up">
          The news page is intentionally factual: product updates only, no pretend press, no
          invented awards, and no filler announcements.
        </p>
      </section>
      <section className="release-principles" aria-labelledby="release-principles-heading">
        <div>
          <h2 id="release-principles-heading">Updates stay factual and specific.</h2>
        </div>
        <div data-reveal="stagger">
          <span>Feature changes</span>
          <span>Coverage changes</span>
          <span>Data workflow changes</span>
          <span>Launch notes</span>
        </div>
      </section>
      {newsPosts.length > 0 ? (
        <div className="post-list news-list" data-reveal="stagger">
          {newsPosts.map((post) => (
            <article key={post.slug} className="post-card news-card">
              <p className="post-date">{formatPostDate(post.date)}</p>
              <div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
              </div>
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
