export type Trip = {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  duration: string;
  nights: number;
  priceUSD: number;
  rating: number;
  reviews: number;
  tagline: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  heroEmoji: string;
  badge?: string;
};

export const trips: Trip[] = [
  {
    id: "kyoto-bloom",
    slug: "kyoto-in-bloom",
    name: "Kyoto in Bloom",
    region: "Asia",
    country: "Japan",
    duration: "7 nights",
    nights: 7,
    priceUSD: 3490,
    rating: 4.9,
    reviews: 312,
    tagline: "Cherry blossoms, tea ceremonies, hidden temples.",
    description:
      "Wander through Arashiyama's bamboo groves at dawn, sip matcha in a 400-year-old teahouse, and watch sakura petals drift over the Philosopher's Path. A small-group journey through Japan's spiritual capital.",
    highlights: [
      "Private tea ceremony with a 15th-generation tea master",
      "Sunrise visit to Fushimi Inari before crowds arrive",
      "Day trip to Nara to feed the sacred deer",
      "Kaiseki dinner at a Michelin-starred ryokan",
    ],
    inclusions: ["Boutique ryokan stays", "All breakfasts + 4 dinners", "Local guides", "JR Rail pass"],
    heroEmoji: "🌸",
    badge: "Bestseller",
  },
  {
    id: "patagonia-trek",
    slug: "patagonia-trek",
    name: "Patagonia Trek",
    region: "South America",
    country: "Chile & Argentina",
    duration: "10 days",
    nights: 9,
    priceUSD: 4280,
    rating: 4.8,
    reviews: 187,
    tagline: "Granite spires, glaciers, and end-of-the-world skies.",
    description:
      "Hike the legendary W Circuit in Torres del Paine, cross into Argentina to stand beneath Perito Moreno glacier, and end with wine in El Calafate. For travelers who like their views earned.",
    highlights: [
      "Full W Circuit guided trek (4 days)",
      "Boat ride to Grey Glacier",
      "Helicopter flight over the ice field (optional)",
      "Asado dinner at an estancia",
    ],
    inclusions: ["Mountain refugios + lodge", "All meals on trek", "Park fees", "Bilingual guides"],
    heroEmoji: "🏔️",
    badge: "Adventure",
  },
  {
    id: "amalfi-escape",
    slug: "amalfi-coast-escape",
    name: "Amalfi Coast Escape",
    region: "Europe",
    country: "Italy",
    duration: "6 nights",
    nights: 6,
    priceUSD: 3990,
    rating: 4.9,
    reviews: 421,
    tagline: "Lemon groves, cliffside villas, slow Italian summers.",
    description:
      "Base yourself in a Positano cliff villa, cook with a nonna in Ravello, sail the coast on a private gozzo, and finish with a long lunch in Capri's Marina Piccola.",
    highlights: [
      "Private boat day along the coast",
      "Cooking class in a hilltop home",
      "Skip-the-line Pompeii tour",
      "Sunset aperitivo at Villa Cimbrone",
    ],
    inclusions: ["4★ cliffside hotel", "Daily breakfast", "Private transfers", "Boat day with crew"],
    heroEmoji: "🍋",
  },
  {
    id: "morocco-mosaic",
    slug: "morocco-mosaic",
    name: "Morocco Mosaic",
    region: "Africa",
    country: "Morocco",
    duration: "8 nights",
    nights: 8,
    priceUSD: 2890,
    rating: 4.7,
    reviews: 256,
    tagline: "Riads, souks, Sahara dunes under a thousand stars.",
    description:
      "From Marrakech's medina to a luxury desert camp in the Erg Chebbi dunes, with stops in Fès and the blue village of Chefchaouen.",
    highlights: [
      "Camel trek to Sahara luxury camp",
      "Riad stays in Marrakech & Fès",
      "Tannery tour in Fès el Bali",
      "Cooking class in a private dar",
    ],
    inclusions: ["Riad + desert camp", "All breakfasts + 5 dinners", "Private driver", "Sandboards 🛹"],
    heroEmoji: "🐪",
  },
  {
    id: "iceland-ring",
    slug: "iceland-ring-road",
    name: "Iceland Ring Road",
    region: "Europe",
    country: "Iceland",
    duration: "9 nights",
    nights: 9,
    priceUSD: 4650,
    rating: 4.8,
    reviews: 198,
    tagline: "Waterfalls, geysers, glaciers, and the aurora.",
    description:
      "A self-drive loop around Iceland with hand-picked stays, secret hot springs, and a private aurora chase with a photographer.",
    highlights: [
      "4×4 rental with full insurance",
      "Glacier hike on Sólheimajökull",
      "Whale watching in Húsavík",
      "Aurora photography night",
    ],
    inclusions: ["4×4 vehicle", "Boutique guesthouses", "Daily breakfast", "Activity bookings"],
    heroEmoji: "❄️",
    badge: "Aurora season",
  },
  {
    id: "vietnam-coast",
    slug: "vietnam-coast-to-coast",
    name: "Vietnam Coast to Coast",
    region: "Asia",
    country: "Vietnam",
    duration: "12 nights",
    nights: 12,
    priceUSD: 3120,
    rating: 4.8,
    reviews: 274,
    tagline: "From Hanoi's old quarter to Mekong river deltas.",
    description:
      "Hanoi street food, an overnight junk in Ha Long Bay, lanterns in Hoi An, and a slow boat through the Mekong.",
    highlights: [
      "Overnight cruise in Ha Long Bay",
      "Tailor-made áo dài in Hoi An",
      "Mekong river homestay",
      "Cu Chi tunnels day trip",
    ],
    inclusions: ["Internal flights", "All transfers", "Daily breakfast + 6 lunches", "Local guides"],
    heroEmoji: "🛶",
  },
  {
    id: "santorini-sail",
    slug: "santorini-sailing-week",
    name: "Santorini Sailing Week",
    region: "Europe",
    country: "Greece",
    duration: "7 nights",
    nights: 7,
    priceUSD: 3780,
    rating: 4.9,
    reviews: 162,
    tagline: "Catamaran island-hopping through the Cyclades.",
    description:
      "Board a private catamaran in Santorini and island-hop to Ios, Folegandros, and Milos with a captain, chef, and a lot of swim stops.",
    highlights: [
      "Private catamaran with crew",
      "Daily chef-prepared meals onboard",
      "Snorkeling in Milos sea caves",
      "Sunset in Oia (without the crowds)",
    ],
    inclusions: ["Catamaran charter", "Captain + chef", "All meals onboard", "Water sports gear"],
    heroEmoji: "⛵",
    badge: "Limited dates",
  },
  {
    id: "safari-serengeti",
    slug: "serengeti-migration-safari",
    name: "Serengeti Migration Safari",
    region: "Africa",
    country: "Tanzania",
    duration: "8 nights",
    nights: 8,
    priceUSD: 7250,
    rating: 5.0,
    reviews: 94,
    tagline: "The great migration, from a luxury tented camp.",
    description:
      "Time your trip with the wildebeest crossing of the Mara River and stay in a mobile luxury camp that follows the herds. Game drives, hot air balloons, sundowners.",
    highlights: [
      "Hot air balloon over the Serengeti",
      "Mobile luxury tented camp",
      "Ngorongoro crater day",
      "Maasai village visit",
    ],
    inclusions: ["All game drives", "All meals + drinks", "Internal flights", "Park fees"],
    heroEmoji: "🦁",
    badge: "Once in a lifetime",
  },
];

export function getTripBySlug(slug: string) {
  return trips.find((t) => t.slug === slug);
}
