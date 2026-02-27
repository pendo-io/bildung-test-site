import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleOverviewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  stats: {
    label: string;
    value: string;
  }[];
  color: "brown" | "amber" | "green";
}

const colorClasses = {
  brown: {
    bg: "bg-primary/10",
    icon: "text-primary",
    border: "border-primary/20",
    hover: "hover:border-primary/40",
  },
  amber: {
    bg: "bg-accent/10",
    icon: "text-accent",
    border: "border-accent/20",
    hover: "hover:border-accent/40",
  },
  green: {
    bg: "bg-success/10",
    icon: "text-success",
    border: "border-success/20",
    hover: "hover:border-success/40",
  },
};

export function ModuleOverview({
  title,
  description,
  icon: Icon,
  href,
  stats,
  color,
}: ModuleOverviewProps) {
  const colors = colorClasses[color];

  return (
    <Link
      to={href}
      data-pendo-id={`module-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "group block rounded-xl border-2 bg-card p-6 transition-all duration-300 card-elevated card-hover",
        colors.border,
        colors.hover
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("rounded-lg p-3", colors.bg)}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">
              {title}
            </h3>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-card-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}
