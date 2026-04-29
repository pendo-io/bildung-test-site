import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ArrowRight, Sparkles, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Destinations", href: "/destinations" },
  { name: "Concierge AI", href: "/concierge" },
  { name: "Stories", href: "/stories" },
];

export function SiteHeader() {
  const { count } = useCart();
  const { userInfo } = useUser();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-xl" data-pendo-id="logo-home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent border-2 border-foreground brutal-shadow">
            <Sparkles className="h-4 w-4" />
          </span>
          Bildung Travel<span className="text-accent">.</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              data-pendo-id={`nav-${l.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                cn(
                  "hover:text-accent transition-colors relative",
                  isActive && "text-foreground after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-accent"
                )
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/cart"
            data-pendo-id="nav-cart"
            className="relative flex items-center gap-2 text-sm font-semibold border-2 border-foreground rounded-full px-3 py-1.5 brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all bg-background"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold px-1.5 border-2 border-foreground">
                {count}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/concierge"
            data-pendo-id="cta-talk-to-concierge"
            className="hidden md:inline-flex items-center gap-2 bg-accent text-accent-foreground border-2 border-foreground rounded-full px-4 py-1.5 font-bold text-sm brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-all"
          >
            <ArrowRight className="h-4 w-4" /> Talk to Concierge
          </NavLink>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden border-2 border-foreground rounded-md p-1.5"
            data-pendo-id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t-2 border-foreground bg-background px-4 py-3 space-y-2">
          {navLinks.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block py-1 font-semibold"
              data-pendo-id={`mobile-nav-${l.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.name}
            </NavLink>
          ))}
          <p className="text-xs text-muted-foreground pt-2">Hi, {userInfo.visitor} · {userInfo.account}</p>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background mt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl mb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground border-2 border-background">
              <Sparkles className="h-4 w-4" />
            </span>
            Bildung Travel<span className="text-accent">.</span>
          </div>
          <p className="text-sm opacity-75">
            Curated, small-group journeys to the world's most unforgettable places.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><NavLink to="/destinations" data-pendo-id="footer-destinations">All destinations</NavLink></li>
            <li><NavLink to="/concierge" data-pendo-id="footer-concierge">Concierge AI</NavLink></li>
            <li><NavLink to="/stories" data-pendo-id="footer-stories">Travel stories</NavLink></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Stay in the loop</h4>
          <p className="text-sm opacity-80 mb-3">New trips, hidden gems, and member-only deals.</p>
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 rounded-md text-foreground text-sm border-2 border-background"
              placeholder="you@email.com"
            />
            <Button
              variant="default"
              size="sm"
              className="bg-accent text-accent-foreground border-2 border-background hover:bg-accent/90"
              data-pendo-id="footer-subscribe"
            >
              Join
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-background/20 text-xs opacity-60 text-center py-4">
        © {new Date().getFullYear()} Bildung Travel
      </div>
    </footer>
  );
}
