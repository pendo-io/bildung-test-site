import { SiteLayout } from "@/components/site/SiteLayout";

const stories = [
  { emoji: "🌸", title: "Why Kyoto in spring is worth the crowds", excerpt: "Notes from our designer's 14th visit and where to actually find quiet sakura.", read: "6 min read" },
  { emoji: "🏔️", title: "How to pack for Patagonia (when the weather lies)", excerpt: "Layers, boots, and the one item nobody talks about but everyone forgets.", read: "8 min read" },
  { emoji: "🍋", title: "A perfect day on the Amalfi Coast", excerpt: "Where to swim, who to call for a boat, and the lemon granita worth driving for.", read: "5 min read" },
  { emoji: "🦁", title: "When to go on safari (the honest answer)", excerpt: "Not all migration months are equal. Here's how to time it right.", read: "9 min read" },
];

export default function Stories() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 md:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-3">Travel stories</h1>
        <p className="text-muted-foreground mb-10">Field notes, hot takes, and trip-planning intel from our designers.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((s) => (
            <article
              key={s.title}
              className="border-2 border-foreground rounded-2xl bg-card brutal-shadow p-6 card-hover"
              data-pendo-id={`story-${s.title.toLowerCase().slice(0, 20).replace(/\s+/g, "-")}`}
            >
              <div className="text-5xl mb-4">{s.emoji}</div>
              <h2 className="text-xl font-extrabold mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{s.excerpt}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.read}</span>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
