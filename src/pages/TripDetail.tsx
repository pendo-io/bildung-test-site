import { SiteLayout } from "@/components/site/SiteLayout";
import { getTripBySlug } from "@/lib/trips";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { Star, Clock, MapPin, Check, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { trackEvent } from "@/lib/pendoTrack";

const departureMonths = ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Sep 2026", "Oct 2026"];

export default function TripDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const trip = slug ? getTripBySlug(slug) : undefined;
  const [travelers, setTravelers] = useState(2);
  const [departure, setDeparture] = useState(departureMonths[1]);

  // Trip Viewed — fires once per trip
  useEffect(() => {
    if (!trip) return;
    trackEvent("Trip Viewed", {
      trip_id: trip.id,
      trip_name: trip.name,
      destination: trip.country,
      price_per_person: trip.priceUSD,
      nights: trip.nights,
      rating: trip.rating,
      review_count: trip.reviews,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id]);

  // Debounced Trip Configuration Changed (departure / travelers)
  const isFirstConfig = useRef(true);
  const lastFieldChangedRef = useRef<"departure" | "travelers" | null>(null);
  useEffect(() => {
    if (!trip) return;
    if (isFirstConfig.current) {
      isFirstConfig.current = false;
      return;
    }
    const field = lastFieldChangedRef.current;
    if (!field) return;
    const t = setTimeout(() => {
      trackEvent("Trip Configuration Changed", {
        trip_id: trip.id,
        trip_name: trip.name,
        destination: trip.country,
        nights: trip.nights,
        price_per_person: trip.priceUSD,
        departure,
        travelers,
        field_changed: field,
      });
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departure, travelers]);

  if (!trip) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-black mb-4">Trip not found</h1>
          <NavLink to="/destinations" className="text-accent font-semibold">Browse all destinations →</NavLink>
        </div>
      </SiteLayout>
    );
  }

  const total = trip.priceUSD * travelers;

  const coreTripPayload = () => ({
    trip_id: trip.id,
    trip_name: trip.name,
    destination: trip.country,
    nights: trip.nights,
    price_per_person: trip.priceUSD,
    rating: trip.rating,
    review_count: trip.reviews,
    departure,
    travelers,
    total_value: total,
    currency: "USD",
  });

  const handleAdd = () => {
    addToCart(trip, travelers, departure);
    const alreadyIn = items.some((i) => i.trip.id === trip.id);
    const cart_size_after = items.reduce((acc, i) => acc + i.travelers, 0) + (alreadyIn ? 0 : travelers);
    trackEvent("Trip Added to Cart", {
      ...coreTripPayload(),
      cart_size_after,
    });
    toast.success(`${trip.name} added to your trip basket`);
  };

  const handleBookNow = () => {
    trackEvent("Book Now Clicked", coreTripPayload());
    addToCart(trip, travelers, departure);
    navigate("/cart");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <NavLink to="/destinations" className="text-sm font-semibold text-muted-foreground hover:text-accent">← All destinations</NavLink>

        <div className="grid lg:grid-cols-5 gap-10 mt-6">
          {/* Hero */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/3] rounded-3xl border-2 border-foreground brutal-shadow-lg bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center text-9xl mb-6">
              {trip.heroEmoji}
              {trip.badge && <span className="absolute top-4 left-4 accent-chip">{trip.badge}</span>}
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {trip.country}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {trip.duration}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-foreground" /> {trip.rating} ({trip.reviews})</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">{trip.name}</h1>
            <p className="text-lg text-muted-foreground mb-8">{trip.description}</p>

            <h2 className="text-2xl font-extrabold mb-3">Highlights</h2>
            <ul className="space-y-2 mb-10">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-extrabold mb-3">What's included</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {trip.inclusions.map((i) => (
                <div key={i} className="border-2 border-foreground rounded-xl px-4 py-3 bg-card text-sm font-semibold">
                  ✓ {i}
                </div>
              ))}
            </div>
          </div>

          {/* Booking card */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 border-2 border-foreground rounded-3xl bg-card brutal-shadow-lg p-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-3xl font-black">${trip.priceUSD.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">per person</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Includes everything listed below.</p>

              <label className="block text-sm font-semibold mb-1">Departure</label>
              <select
                value={departure}
                onChange={(e) => {
                  lastFieldChangedRef.current = "departure";
                  setDeparture(e.target.value);
                }}
                className="w-full border-2 border-foreground rounded-xl px-3 py-2 mb-4 bg-background"
                data-pendo-id="select-departure"
              >
                {departureMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <label className="block text-sm font-semibold mb-1">Travelers</label>
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => {
                    lastFieldChangedRef.current = "travelers";
                    setTravelers((n) => Math.max(1, n - 1));
                  }}
                  className="h-10 w-10 rounded-full border-2 border-foreground font-bold"
                  data-pendo-id="travelers-decrement"
                >−</button>
                <span className="text-xl font-extrabold w-8 text-center">{travelers}</span>
                <button
                  onClick={() => {
                    lastFieldChangedRef.current = "travelers";
                    setTravelers((n) => n + 1);
                  }}
                  className="h-10 w-10 rounded-full border-2 border-foreground font-bold"
                  data-pendo-id="travelers-increment"
                >+</button>
              </div>

              <div className="border-t-2 border-dashed border-foreground my-4" />
              <div className="flex justify-between font-bold text-lg mb-5">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleBookNow}
                data-pendo-id="book-now"
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all mb-2"
              >
                Book now <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleAdd}
                data-pendo-id="add-to-cart"
                className="w-full inline-flex items-center justify-center gap-2 bg-background border-2 border-foreground rounded-full px-6 py-3 font-bold hover:bg-secondary transition-all"
              >
                <ShoppingBag className="h-4 w-4" /> Add to basket
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Free changes up to 60 days before departure.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
