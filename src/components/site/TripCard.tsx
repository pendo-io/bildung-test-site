import { Trip } from "@/lib/trips";
import { Star, Clock, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <NavLink
      to={`/destinations/${trip.slug}`}
      data-pendo-id={`trip-card-${trip.slug}`}
      className="group block rounded-2xl border-2 border-foreground bg-card brutal-shadow card-hover overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center text-7xl border-b-2 border-foreground">
        <span>{trip.heroEmoji}</span>
        {trip.badge && (
          <span className="absolute top-3 left-3 accent-chip text-xs">
            {trip.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-background border-2 border-foreground rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
          <Star className="h-3 w-3 fill-foreground" /> {trip.rating}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {trip.country}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {trip.duration}</span>
        </div>
        <h3 className="text-xl font-extrabold mb-1 group-hover:text-accent transition-colors">{trip.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{trip.tagline}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-2xl font-extrabold">${trip.priceUSD.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground"> / per person</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{trip.reviews} reviews</span>
        </div>
      </div>
    </NavLink>
  );
}
