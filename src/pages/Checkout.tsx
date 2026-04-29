import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      clear();
      toast.success("Booking confirmed! Check your inbox.");
    }, 1200);
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent border-2 border-foreground brutal-shadow mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black mb-3">You're going! 🎉</h1>
          <p className="text-muted-foreground mb-8">
            Your trip is confirmed. A travel designer will email you within 24 hours to finalize details.
          </p>
          <button
            onClick={() => navigate("/")}
            data-pendo-id="back-to-home"
            className="inline-flex items-center gap-2 bg-foreground text-background border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow"
          >
            Back to home
          </button>
        </section>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-3xl font-black mb-3">Nothing to check out</h1>
          <button
            onClick={() => navigate("/destinations")}
            data-pendo-id="checkout-empty-browse"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow"
          >
            Find a trip
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-2 border-foreground rounded-2xl bg-card brutal-shadow p-6">
              <h2 className="font-extrabold text-xl mb-4">Traveler details</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="First name" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background" />
                <input required placeholder="Last name" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background" />
                <input required type="email" placeholder="Email" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background sm:col-span-2" />
                <input required placeholder="Phone" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background sm:col-span-2" />
              </div>
            </div>

            <div className="border-2 border-foreground rounded-2xl bg-card brutal-shadow p-6">
              <h2 className="font-extrabold text-xl mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4" /> Payment
              </h2>
              <div className="grid gap-3">
                <input required placeholder="Card number" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background" />
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="MM / YY" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background" />
                  <input required placeholder="CVC" className="border-2 border-foreground rounded-xl px-3 py-2 bg-background" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Demo only — no real charge.</p>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 border-2 border-foreground rounded-2xl bg-card brutal-shadow-lg p-6">
              <h2 className="font-extrabold text-xl mb-4">Your trips</h2>
              <ul className="space-y-3 mb-4 text-sm">
                {items.map((i) => (
                  <li key={i.trip.id} className="flex justify-between">
                    <span>
                      {i.trip.heroEmoji} {i.trip.name} <span className="text-muted-foreground">× {i.travelers}</span>
                    </span>
                    <span className="font-semibold">${(i.trip.priceUSD * i.travelers).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t-2 border-dashed border-foreground my-3" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Taxes & fees</span>
                <span>${taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-lg mb-5">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-pendo-id="confirm-booking"
                className="w-full bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow disabled:opacity-60"
              >
                {submitting ? "Processing…" : `Confirm booking · $${total.toLocaleString()}`}
              </button>
            </div>
          </aside>
        </form>
      </section>
    </SiteLayout>
  );
}
