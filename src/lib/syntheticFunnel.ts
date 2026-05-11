// Synthetic purchase-funnel event emitter for demo bot users.
// Fires Pendo track events in the correct sequence so funnel/CVR reports
// in Pendo look realistic without the bot actually navigating pages.
//
// Drop-off is gated by the bot's "experience tier" so that:
//   - good   experience → high CVR
//   - normal experience → average CVR
//   - bad    experience → very low CVR (lots of frustration)

import { trips, Trip } from "@/lib/trips";
import { trackEvent } from "@/lib/pendoTrack";

export type ExperienceTier = "good" | "normal" | "bad";

// Per-stage continue probability. Multiply across stages to get effective CVR.
// Targets (filter → booking):
//   good   ≈ 20%   (0.97 * 0.92 * 0.93 * 0.88 * 0.82 * 0.75 * 0.45 ≈ 0.202)
//   normal ≈ 3%    (0.85 * 0.75 * 0.78 * 0.65 * 0.55 * 0.45 * 0.38 ≈ 0.030)
//   bad    ≈ 0.01% (0.60 * 0.45 * 0.50 * 0.35 * 0.25 * 0.15 * 0.06 ≈ 0.0001)
const STAGE_PROBABILITIES: Record<ExperienceTier, number[]> = {
  // [filter, card, view, configure, addToCart, checkoutStart, bookingComplete]
  good:   [0.97, 0.92, 0.93, 0.88, 0.82, 0.75, 0.45],
  normal: [0.85, 0.75, 0.78, 0.65, 0.55, 0.45, 0.38],
  bad:    [0.60, 0.45, 0.50, 0.35, 0.25, 0.15, 0.06],
};

const REGIONS = ["All", "Asia", "Europe", "Africa", "South America"];
const SORTS = ["popular", "price-low", "price-high"];
const SOURCES = ["home_featured", "destinations_listing"];
const DEPARTURES = [
  "2026-03-15", "2026-04-12", "2026-05-10", "2026-06-07",
  "2026-07-05", "2026-09-13", "2026-10-11", "2026-11-08",
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function classifyExperience(rageCount: number, negativeReactions: number, totalPrompts: number): ExperienceTier {
  if (totalPrompts === 0) return "normal";
  const negRatio = (rageCount + negativeReactions) / totalPrompts;
  if (rageCount >= 2 || negRatio >= 0.5) return "bad";
  if (rageCount === 0 && negativeReactions === 0) return "good";
  return "normal";
}

/**
 * Fire a realistic, sequential purchase-funnel for one bot session.
 *
 * Optional `interleaveAt` (0..7) runs `interleaveFn` BEFORE that stage index
 * (0 = before filter, 7 = after Booking Completed). If the funnel drops off
 * before reaching the interleave position, the hook still runs once at the
 * drop-off point so the Concierge interaction is not lost.
 */
export async function runSyntheticFunnel(opts: {
  rageCount: number;
  negativeReactions: number;
  totalPrompts: number;
  shouldStop?: () => boolean;
  interleaveAt?: number;
  interleaveFn?: () => Promise<void>;
}): Promise<void> {
  const tier = classifyExperience(opts.rageCount, opts.negativeReactions, opts.totalPrompts);
  const probs = STAGE_PROBABILITIES[tier];
  const stop = opts.shouldStop ?? (() => false);

  console.debug("[syntheticFunnel] starting", { tier, ...opts });

  // Stage 0: Destination Filter Applied
  if (stop() || Math.random() > probs[0]) return;
  await sleep(randInt(200, 600));
  const region = pick(REGIONS);
  const sort = pick(SORTS) as "popular" | "price-low" | "price-high";
  const filtered = region === "All" ? trips : trips.filter((t) => t.region === region);
  trackEvent("Destination Filter Applied", {
    filter: region,
    sort,
    results_count: filtered.length,
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 1: Trip Card Clicked
  if (stop() || filtered.length === 0 || Math.random() > probs[1]) return;
  await sleep(randInt(400, 1200));
  const trip: Trip = pick(filtered);
  const position = randInt(1, Math.min(filtered.length, 9));
  const source = pick(SOURCES);
  trackEvent("Trip Card Clicked", {
    trip_id: trip.id,
    trip_name: trip.name,
    destination: trip.country,
    nights: trip.nights,
    price_per_person: trip.priceUSD,
    rating: trip.rating,
    position,
    source,
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 2: Trip Viewed
  if (stop() || Math.random() > probs[2]) return;
  await sleep(randInt(300, 800));
  trackEvent("Trip Viewed", {
    trip_id: trip.id,
    trip_name: trip.name,
    destination: trip.country,
    nights: trip.nights,
    price_per_person: trip.priceUSD,
    rating: trip.rating,
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 3: Trip Configuration Changed
  if (stop() || Math.random() > probs[3]) return;
  await sleep(randInt(800, 2000));
  const travelers = randInt(1, 4);
  const departure = pick(DEPARTURES);
  trackEvent("Trip Configuration Changed", {
    trip_id: trip.id,
    travelers,
    departure,
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 4: Trip Added to Cart
  if (stop() || Math.random() > probs[4]) return;
  await sleep(randInt(400, 1000));
  const lineValue = trip.priceUSD * travelers;
  trackEvent("Trip Added to Cart", {
    trip_id: trip.id,
    trip_name: trip.name,
    destination: trip.country,
    travelers,
    departure,
    line_value: lineValue,
    cart_size_after: travelers,
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 5: Checkout Started
  if (stop() || Math.random() > probs[5]) return;
  await sleep(randInt(1000, 3000));
  const taxes = Math.round(lineValue * 0.08);
  const total = lineValue + taxes;
  trackEvent("Checkout Started", {
    cart_item_count: 1,
    total_travelers: travelers,
    subtotal: lineValue,
    taxes_fees: taxes,
    cart_total: total,
    currency: "USD",
    trip_ids: [trip.id],
    destinations: [trip.country],
    synthetic: true,
    experience_tier: tier,
  });

  // Stage 6: Booking Completed
  if (stop() || Math.random() > probs[6]) return;
  await sleep(randInt(1500, 4000));
  trackEvent("Booking Completed", {
    order_id: `ORD-${Date.now()}-${randInt(1000, 9999)}`,
    item_count: 1,
    total_travelers: travelers,
    total_value: total,
    currency: "USD",
    trip_ids: [trip.id],
    destinations: [trip.country],
    departures: [departure],
    synthetic: true,
    experience_tier: tier,
  });

  console.debug("[syntheticFunnel] completed booking", { tier });
}
