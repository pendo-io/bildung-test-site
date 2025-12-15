import { cn } from "@/lib/utils";
import { Check, Circle, X } from "lucide-react";

export type StageStatus = "completed" | "current" | "upcoming" | "lost";

export interface Stage {
  id: string;
  name: string;
  status: StageStatus;
  probability: number;
  completedAt?: string;
}

const defaultStages: Stage[] = [
  { id: "lead", name: "Lead", status: "upcoming", probability: 10 },
  { id: "qualification", name: "Qualification", status: "upcoming", probability: 25 },
  { id: "discovery", name: "Discovery", status: "upcoming", probability: 40 },
  { id: "proposal", name: "Proposal", status: "upcoming", probability: 60 },
  { id: "negotiation", name: "Negotiation", status: "upcoming", probability: 80 },
  { id: "closed", name: "Closed Won", status: "upcoming", probability: 100 },
];

interface OpportunityStageProgressProps {
  currentStage: string;
  isWon?: boolean;
  isLost?: boolean;
  onStageClick?: (stageId: string) => void;
}

export function OpportunityStageProgress({
  currentStage,
  isWon = false,
  isLost = false,
  onStageClick,
}: OpportunityStageProgressProps) {
  const getStages = (): Stage[] => {
    const currentIndex = defaultStages.findIndex((s) => s.id === currentStage);
    
    return defaultStages.map((stage, index) => {
      let status: StageStatus = "upcoming";
      
      if (isLost) {
        if (index < currentIndex) status = "completed";
        else if (index === currentIndex) status = "lost";
      } else if (isWon) {
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
            {/* Stage Node */}
            <button
              onClick={() => onStageClick?.(stage.id)}
              disabled={stage.status === "lost" || isWon || isLost}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                stage.status === "completed" &&
                  "bg-success border-success text-success-foreground",
                stage.status === "current" &&
                  "bg-accent border-accent text-accent-foreground animate-pulse-subtle",
                stage.status === "upcoming" &&
                  "bg-muted border-border text-muted-foreground hover:border-accent/50",
                stage.status === "lost" &&
                  "bg-destructive border-destructive text-destructive-foreground",
                !isWon && !isLost && stage.status === "upcoming" && "cursor-pointer"
              )}
            >
              {stage.status === "completed" && <Check className="h-5 w-5" />}
              {stage.status === "current" && (
                <Circle className="h-4 w-4 fill-current" />
              )}
              {stage.status === "upcoming" && (
                <span className="text-xs font-medium">{stage.probability}%</span>
              )}
              {stage.status === "lost" && <X className="h-5 w-5" />}
            </button>

            {/* Connector Line */}
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

      {/* Stage Labels */}
      <div className="flex items-start justify-between mt-3">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-1 text-center px-1">
            <p
              className={cn(
                "text-xs font-medium",
                stage.status === "current" && "text-accent",
                stage.status === "completed" && "text-success",
                stage.status === "lost" && "text-destructive",
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
