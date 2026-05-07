import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/contexts/CartContext";
import { NavLink, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { trackEvent } from "@/lib/pendoTrack";

export default function Cart() {
  const { items, removeFromCart, updateTravelers, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-4xl font-black mb-3">Your trip basket is empty</h1>
          <p className="text-muted-foreground mb-8">Find a journey worth packing for.</p>
          <NavLink
            to="/destinations"
            data-pendo-id="empty-cart-browse"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow"
          >
            Browse destinations <ArrowRight className="h-4 w-4" />
          </NavLink>
        </section>
      </SiteLayout>
    );
  }

  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + taxes;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-12">
        <h1 className="text-4xl font-black mb-8">Your trip basket</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.trip.id}
                className="flex gap-4 border-2 border-foreground rounded-2xl bg-card brutal-shadow p-4"
              >
                <div className="h-24 w-24 rounded-xl border-2 border-foreground bg-accent/30 flex items-center justify-center text-4xl shrink-0">
                  {item.trip.heroEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-lg">{item.trip.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.trip.country} · {item.trip.duration} · Departs {item.departure}</p>
                    </div>
                    <button
                      onClick={() => {
                        const cart_size_after = items
                          .filter((i) => i.trip.id !== item.trip.id)
                          .reduce((acc, i) => acc + i.travelers, 0);
                        trackEvent("Trip Removed from Cart", {
                          trip_id: item.trip.id,
                          trip_name: item.trip.name,
                          destination: item.trip.country,
                          departure: item.departure,
                          travelers: item.travelers,
                          line_value: item.trip.priceUSD * item.travelers,
                          cart_size_after,
                        });
                        removeFromCart(item.trip.id);
                      }}
                      data-pendo-id={`remove-${item.trip.slug}`}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTravelers(item.trip.id, item.travelers - 1)}
                        className="h-8 w-8 rounded-full border-2 border-foreground font-bold text-sm"
                        data-pendo-id={`cart-decrement-${item.trip.slug}`}
                      >−</button>
                      <span className="font-bold w-6 text-center">{item.travelers}</span>
                      <button
                        onClick={() => updateTravelers(item.trip.id, item.travelers + 1)}
                        className="h-8 w-8 rounded-full border-2 border-foreground font-bold text-sm"
                        data-pendo-id={`cart-increment-${item.trip.slug}`}
                      >+</button>
                      <span className="text-xs text-muted-foreground ml-1">travelers</span>
                    </div>
                    <span className="font-extrabold text-lg">
                      ${(item.trip.priceUSD * item.travelers).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside>
            <div className="border-2 border-foreground rounded-2xl bg-card brutal-shadow-lg p-6 sticky top-24">
              <h2 className="font-extrabold text-xl mb-4">Order summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & fees</span>
                  <span className="font-semibold">${taxes.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-foreground my-4" />
              <div className="flex justify-between font-extrabold text-lg mb-5">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                data-pendo-id="proceed-to-checkout"
                className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-6 py-3 font-bold brutal-shadow"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <NavLink
                to="/destinations"
                data-pendo-id="continue-shopping"
                className="block w-full text-center mt-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Continue exploring
              </NavLink>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
