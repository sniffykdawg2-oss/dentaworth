import { blogPosts } from "../posts";
import { PageShell } from "../components/PageShell";

export function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title="Notes on dental cost transparency."
      intro="Longer-form writing about reading estimates, navigating dental costs, and how the guide is built."
      variant="editorial"
      heroImage="/images/page-hero-family-outdoors.png"
    >
      <div className="blog-gallery-heading">
        <p className="eyebrow">DentaWorth blog</p>
        <h2>Explore the latest from our blog.</h2>
      </div>
      <div className="post-list blog-gallery">
          {blogPosts.map((post) => (
            <a key={post.slug} className="post-card" href={`/blog/${post.slug}`}>
              <div className="post-card-image"><img src={post.image || "/images/mother-daughter-smile.jpg"} alt="" /></div>
              <div className="post-card-body">
              <p className="post-date">{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
                <span className="button secondary">Read article <span aria-hidden="true">→</span></span>
              </div>
            </a>
          ))}
      </div>
    </PageShell>
  );
}
