import { SiteLayout } from "@/components/site/SiteLayout";
import { InlineChatPanel } from "@/components/bill-guard/InlineChatPanel";
import { Sparkles, MapPin, Compass } from "lucide-react";

export default function Concierge() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <span className="accent-chip text-xs mb-5">
              <Sparkles className="h-3 w-3 mr-1" /> Concierge AI · always on
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Your <span className="text-accent">personal</span> travel designer.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Ask anything: where to go in March, how to pack for Patagonia, which trip is right for two adults
              and a teenager. Concierge AI knows every itinerary and every traveler quirk.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent border-2 border-foreground flex items-center justify-center shrink-0">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Destination matchmaking</h3>
                  <p className="text-sm text-muted-foreground">Tell us your vibe and dates — get 3 trips that fit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent border-2 border-foreground flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Custom itineraries</h3>
                  <p className="text-sm text-muted-foreground">Need to swap Tokyo for Osaka? Add a kids' day? Done.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent border-2 border-foreground flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">In-trip support</h3>
                  <p className="text-sm text-muted-foreground">Restaurant booked. Train missed. Concierge has you.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="border-2 border-foreground rounded-3xl bg-card brutal-shadow-lg overflow-hidden h-[640px]">
              <InlineChatPanel />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
