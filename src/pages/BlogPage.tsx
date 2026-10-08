import { ArrowRight } from "lucide-react";
import { blogPosts, formatPostDate } from "../posts";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";
import { handleLinkClick } from "../nav";
import { toWebp } from "../media";

export function BlogPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="Blog"
      title="Notes on dental cost transparency."
      intro="Longer-form writing about reading estimates, navigating dental costs, and how the guide is built."
      variant="editorial"
      heroImage="/images/page-hero-family-outdoors.png"
    >
      <div className="blog-gallery-heading">
        <MaskHeading>Explore the latest from our blog.</MaskHeading>
      </div>
      <div className="post-list blog-gallery" data-reveal="stagger">
        {blogPosts.map((post) => (
          <a
            key={post.slug}
            className="post-card"
            href={`/blog/${post.slug}`}
            onClick={(event) => handleLinkClick(event, `/blog/${post.slug}`, navigate)}
          >
            <div className="post-card-image">
              <img src={toWebp(post.image || "/images/mother-daughter-smile.jpg")} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="post-card-body">
              <p className="post-date">{formatPostDate(post.date)}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <span className="post-card-link">
                Read article <ArrowRight size={16} aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
