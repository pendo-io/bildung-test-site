import { SiteLayout } from "@/components/site/SiteLayout";
import { TripCard } from "@/components/site/TripCard";
import { trips } from "@/lib/trips";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, ShieldCheck, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { trackEvent } from "@/lib/pendoTrack";

const Index = () => {
  const featured = trips.slice(0, 6);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-center">
          <span className="accent-chip text-xs mb-6">
            <Sparkles className="h-3 w-3 mr-1" /> 60+ destinations · curated by humans, planned with AI
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Travel that <span className="text-accent">actually</span>
            <br />moves you.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            Hand-picked small-group journeys to the world's most unforgettable corners.
            Book a trip, or chat with our <span className="font-semibold text-foreground">Concierge AI</span> to design your own.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NavLink
              to="/destinations"
              data-pendo-id="hero-browse-trips"
              className="inline-flex items-center gap-2 bg-foreground text-background border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all"
            >
              Browse trips <ArrowRight className="h-4 w-4" />
            </NavLink>
            <NavLink
              to="/concierge"
              data-pendo-id="hero-talk-to-concierge"
              onClick={() => trackEvent("Concierge Opened", { source: "hero", page: "/" })}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Plan with Concierge AI
            </NavLink>
          </div>

          {/* Trust strip */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-widest font-bold text-muted-foreground">
            <span>Featured in Condé Nast</span>
            <span>·</span>
            <span>AFAR top picks 2025</span>
            <span>·</span>
            <span>4.9★ Trustpilot</span>
            <span>·</span>
            <span>Climate-positive trips</span>
          </div>
        </div>
      </section>

      {/* Featured trips */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Featured journeys</h2>
            <p className="text-muted-foreground">Loved by travelers, curated by us.</p>
          </div>
          <NavLink
            to="/destinations"
            data-pendo-id="see-all-destinations"
            className="hidden md:inline-flex items-center gap-1 font-semibold text-sm hover:text-accent"
          >
            See all <ArrowRight className="h-4 w-4" />
          </NavLink>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, i) => (
            <TripCard key={t.id} trip={t} position={i + 1} source="home_featured" />
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-foreground text-background py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-3 gap-10">
          <div>
            <div className="h-12 w-12 rounded-xl bg-accent border-2 border-background flex items-center justify-center text-accent-foreground mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">Hand-picked, never generic</h3>
            <p className="opacity-75 text-sm">Every itinerary is built and walked by a real travel designer before you ever see it.</p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-xl bg-accent border-2 border-background flex items-center justify-center text-accent-foreground mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">AI Concierge, on call 24/7</h3>
            <p className="opacity-75 text-sm">Customize anything, ask anything. Our Concierge AI knows every trip and every traveler quirk.</p>
          </div>
          <div>
            <div className="h-12 w-12 rounded-xl bg-accent border-2 border-background flex items-center justify-center text-accent-foreground mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">Worry-free booking</h3>
            <p className="opacity-75 text-sm">Free changes up to 60 days out. 24/7 in-trip support. Travel insurance included.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Where to next?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Tell our Concierge AI what you're dreaming about. We'll design a trip you couldn't have planned yourself.
        </p>
        <NavLink
          to="/concierge"
          data-pendo-id="cta-bottom-concierge"
          onClick={() => trackEvent("Concierge Opened", { source: "cta_bottom", page: "/" })}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-8 py-4 font-bold text-lg brutal-shadow-lg hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          Start planning <ArrowRight className="h-5 w-5" />
        </NavLink>
      </section>
    </SiteLayout>
  );
};

export default Index;
