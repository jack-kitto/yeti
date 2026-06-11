import Image from "next/image";
import Link from "next/link";
import { getLandingPageContent } from "@/landing/landing-page";

export function LandingPage() {
  const {
    productName,
    headline,
    tagline,
    features,
    heroImageSrc,
    heroImageAlt,
    homeStationHref,
    homeStationCta,
    startPageHref,
    startPageCta,
    waitlistHref,
    waitlistCta,
    earlyAccessNote,
    footerGithubHref,
    footerGithubLabel,
    footerContextHref,
    footerContextLabel,
    footerLocalTierNote,
  } = getLandingPageContent();

  return (
    <main className="landing-page">
      <div className="landing-page-inner">
        <header className="landing-page-header">
          <p className="landing-page-eyebrow">{productName}</p>
          <h1 className="landing-page-headline">{headline}</h1>
          <p className="landing-page-tagline">{tagline}</p>

          <div className="landing-page-actions">
            <Link href={homeStationHref} className="landing-page-cta landing-page-cta--primary">
              {homeStationCta}
            </Link>
            {waitlistHref ? (
              <a
                href={waitlistHref}
                className="landing-page-cta landing-page-cta--secondary"
                rel="noopener noreferrer"
                target="_blank"
              >
                {waitlistCta}
              </a>
            ) : null}
            <Link href={startPageHref} className="landing-page-cta landing-page-cta--ghost">
              {startPageCta}
            </Link>
          </div>

          <p className="landing-page-note">{earlyAccessNote}</p>
        </header>

        <figure className="landing-page-hero">
          <Image
            src={heroImageSrc}
            alt={heroImageAlt}
            width={1512}
            height={982}
            priority
            className="landing-page-hero-image"
          />
        </figure>

        <section className="landing-page-features" aria-label="Features">
          <ul className="landing-page-feature-list">
            {features.map((feature) => (
              <li key={feature.title} className="landing-page-feature">
                <h2 className="landing-page-feature-title">{feature.title}</h2>
                <p className="landing-page-feature-copy">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="landing-page-footer">
          <p className="landing-page-footer-note">{footerLocalTierNote}</p>
          <nav className="landing-page-footer-links" aria-label="Project links">
            <a
              href={footerGithubHref}
              className="landing-page-footer-link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {footerGithubLabel}
            </a>
            <a
              href={footerContextHref}
              className="landing-page-footer-link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {footerContextLabel}
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
