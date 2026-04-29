import { SiteLayout } from "@/components/site/SiteLayout";
import { TripCard } from "@/components/site/TripCard";
import { trips } from "@/lib/trips";
import { useMemo, useState } from "react";

const regions = ["All", "Asia", "Europe", "Africa", "South America"];

export default function Destinations() {
  const [region, setRegion] = useState("All");
  const [sort, setSort] = useState<"popular" | "price-low" | "price-high">("popular");

  const filtered = useMemo(() => {
    let list = region === "All" ? trips : trips.filter((t) => t.region === region);
    if (sort === "price-low") list = [...list].sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-high") list = [...list].sort((a, b) => b.priceUSD - a.priceUSD);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [region, sort]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-3">All destinations</h1>
        <p className="text-muted-foreground mb-8">Pick a journey. Or talk to Concierge AI to build one.</p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-y-2 border-foreground py-4">
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                data-pendo-id={`filter-region-${r.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 border-foreground transition-all ${
                  region === r
                    ? "bg-accent text-accent-foreground brutal-shadow"
                    : "bg-background hover:bg-secondary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="border-2 border-foreground rounded-full px-4 py-1.5 text-sm font-semibold bg-background"
            data-pendo-id="sort-trips"
          >
            <option value="popular">Most popular</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
