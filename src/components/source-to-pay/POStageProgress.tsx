import { cn } from "@/lib/utils";
import { Check, Circle, X } from "lucide-react";

export type POStageStatus = "completed" | "current" | "upcoming" | "cancelled";

export interface POStage {
  id: string;
  name: string;
  status: POStageStatus;
}

const defaultStages: POStage[] = [
  { id: "requested", name: "Requested", status: "upcoming" },
  { id: "approved", name: "Approved", status: "upcoming" },
  { id: "ordered", name: "Ordered", status: "upcoming" },
  { id: "shipped", name: "Shipped", status: "upcoming" },
  { id: "received", name: "Received", status: "upcoming" },
  { id: "paid", name: "Paid", status: "upcoming" },
];

interface POStageProgressProps {
  currentStage: string;
  isCancelled?: boolean;
  isComplete?: boolean;
}

export function POStageProgress({
  currentStage,
  isCancelled = false,
  isComplete = false,
}: POStageProgressProps) {
  const getStages = (): POStage[] => {
    const currentIndex = defaultStages.findIndex((s) => s.id === currentStage);

    return defaultStages.map((stage, index) => {
      let status: POStageStatus = "upcoming";

      if (isCancelled) {
        if (index < currentIndex) status = "completed";
        else if (index === currentIndex) status = "cancelled";
      } else if (isComplete) {
        status = "completed";
      } else {
        if (index < currentIndex) status = "completed";
        else if (index === currentIndex) status = "current";
      }

      return { ...stage, status };
    });
  };

  const stages = getStages();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center flex-1">
            <div
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                stage.status === "completed" &&
                  "bg-success border-success text-success-foreground",
                stage.status === "current" &&
                  "bg-accent border-accent text-accent-foreground animate-pulse-subtle",
                stage.status === "upcoming" &&
                  "bg-muted border-border text-muted-foreground",
                stage.status === "cancelled" &&
                  "bg-destructive border-destructive text-destructive-foreground"
              )}
            >
              {stage.status === "completed" && <Check className="h-5 w-5" />}
              {stage.status === "current" && (
                <Circle className="h-4 w-4 fill-current" />
              )}
              {stage.status === "upcoming" && (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
              {stage.status === "cancelled" && <X className="h-5 w-5" />}
            </div>

            {index < stages.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 rounded-full transition-colors duration-300",
                  stage.status === "completed" ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-start justify-between mt-3">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-1 text-center px-1">
            <p
              className={cn(
                "text-xs font-medium",
                stage.status === "current" && "text-accent",
                stage.status === "completed" && "text-success",
                stage.status === "cancelled" && "text-destructive",
                stage.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {stage.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
