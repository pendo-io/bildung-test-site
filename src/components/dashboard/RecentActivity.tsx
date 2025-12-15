import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "s2p" | "l2c" | "h2r";
}

const activities: Activity[] = [
  {
    id: "1",
    title: "New Purchase Order Created",
    description: "PO-2024-0892 for office supplies",
    time: "2 min ago",
    type: "s2p",
  },
  {
    id: "2",
    title: "Lead Converted to Opportunity",
    description: "Acme Corp - Enterprise Shipping Contract",
    time: "15 min ago",
    type: "l2c",
  },
  {
    id: "3",
    title: "Employee Onboarding Complete",
    description: "Sarah Johnson - Senior Logistics Manager",
    time: "1 hour ago",
    type: "h2r",
  },
  {
    id: "4",
    title: "Invoice Approved",
    description: "INV-2024-1456 - $45,230.00",
    time: "2 hours ago",
    type: "s2p",
  },
  {
    id: "5",
    title: "Sales Order Shipped",
    description: "SO-2024-3421 - Express Delivery",
    time: "3 hours ago",
    type: "l2c",
  },
];

const typeColors = {
  s2p: "bg-chart-1",
  l2c: "bg-chart-2",
  h2r: "bg-chart-3",
};

const typeLabels = {
  s2p: "S2P",
  l2c: "L2C",
  h2r: "H2R",
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 card-elevated">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Recent Activity
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div
                className={cn(
                  "h-2 w-2 rounded-full mt-2",
                  typeColors[activity.type]
                )}
              />
              {index < activities.length - 1 && (
                <div className="absolute left-1/2 top-4 h-full w-px -translate-x-1/2 bg-border" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium text-primary-foreground",
                      typeColors[activity.type]
                    )}
                  >
                    {typeLabels[activity.type]}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
