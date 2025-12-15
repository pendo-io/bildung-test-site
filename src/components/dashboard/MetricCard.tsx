import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 card-elevated card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-card-foreground">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              {change.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {change.value}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "accent" && "bg-accent/10 text-accent",
            variant === "default" && "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          variant === "primary" && "bg-primary",
          variant === "accent" && "bg-accent",
          variant === "default" && "bg-foreground"
        )}
      />
    </div>
  );
}
