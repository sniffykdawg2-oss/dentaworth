import {
  Building2,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

type Listing = {
  title: string;
  county: string;
  category: string;
  price: string;
  description: string;
};

const listings: Listing[] = [
  {
    title: "Turnkey general practice",
    county: "Broward County",
    category: "Practice Sale",
    price: "$725k",
    description:
      "Four operatories, hygiene-heavy patient base, and seller transition support available.",
  },
  {
    title: "Pediatric expansion space",
    county: "Orange County",
    category: "Lease Opportunity",
    price: "$42/sq ft",
    description:
      "High-visibility retail corridor with plumbing rough-ins and strong family demographics.",
  },
  {
    title: "Digital pano and sensors",
    county: "Miami-Dade County",
    category: "Equipment",
    price: "$18k",
    description:
      "Owner upgrading equipment. Bundle includes installation records and recent service history.",
  },
];

const counties = ["Miami-Dade", "Broward", "Palm Beach", "Orange", "Hillsborough"];

export function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Dentaworth home">
          <Building2 size={24} aria-hidden="true" />
          <span>Dentaworth</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#listings">Listings</a>
          <a href="#submit">Submit</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Florida dental marketplace</p>
          <h1>Find dental practice opportunities without digging through general classifieds.</h1>
          <p>
            Dentaworth helps dentists, brokers, owners, and operators discover dental-specific
            listings across Florida, from practice sales to equipment and expansion space.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#listings">
              <Search size={18} aria-hidden="true" />
              Browse listings
            </a>
            <a className="button secondary" href="#submit">
              <Upload size={18} aria-hidden="true" />
              Submit listing
            </a>
          </div>
        </div>

        <form className="search-panel" aria-label="Search listings">
          <label>
            Keyword
            <input placeholder="practice, equipment, lease..." />
          </label>
          <label>
            County
            <select defaultValue="">
              <option value="" disabled>
                Select county
              </option>
              {counties.map((county) => (
                <option key={county}>{county}</option>
              ))}
            </select>
          </label>
          <button type="button">
            <Search size={18} aria-hidden="true" />
            Search
          </button>
        </form>
      </section>

      <section className="trust-strip" aria-label="Marketplace highlights">
        <div>
          <ShieldCheck aria-hidden="true" />
          <span>Dental-only listings</span>
        </div>
        <div>
          <MapPin aria-hidden="true" />
          <span>Florida first</span>
        </div>
        <div>
          <ClipboardList aria-hidden="true" />
          <span>Owner-reviewed submissions</span>
        </div>
      </section>

      <section className="section" id="listings">
        <div className="section-heading">
          <p className="eyebrow">Fresh opportunities</p>
          <h2>Featured listings</h2>
        </div>
        <div className="listing-grid">
          {listings.map((listing) => (
            <article className="listing-card" key={listing.title}>
              <div className="listing-meta">
                <span>{listing.category}</span>
                <strong>{listing.price}</strong>
              </div>
              <h3>{listing.title}</h3>
              <p className="county">
                <MapPin size={16} aria-hidden="true" />
                {listing.county}
              </p>
              <p>{listing.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="submit-band" id="submit">
        <div>
          <p className="eyebrow">Built for brokers and operators</p>
          <h2>Submit once. Reach people who actually care about dental ops.</h2>
          <p>
            The first version will store listing submissions in Firestore, support image uploads in
            Firebase Storage, and keep publishing control behind Firebase Auth.
          </p>
        </div>
        <a className="button primary" href="mailto:hello@dentaworth.com">
          <CheckCircle2 size={18} aria-hidden="true" />
          Start submission
        </a>
      </section>

      <footer id="contact">
        <span>Dentaworth</span>
        <a href="mailto:hello@dentaworth.com">hello@dentaworth.com</a>
      </footer>
    </main>
  );
}
