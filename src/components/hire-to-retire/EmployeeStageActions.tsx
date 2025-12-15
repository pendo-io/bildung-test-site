import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FileCheck,
  ClipboardCheck,
  UserCheck,
  Laptop,
  Key,
  GraduationCap,
  Target,
  Calendar,
  Heart,
  ArrowRight,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StageAction {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface StageConfig {
  title: string;
  description: string;
  actions: StageAction[];
  nextAction: string;
}

const stageConfigs: Record<string, StageConfig> = {
  offer: {
    title: "Offer Stage",
    description: "Extend and finalize job offer",
    actions: [
      { id: "send_offer", label: "Send offer letter", icon: FileCheck },
      { id: "negotiate_terms", label: "Negotiate terms if needed", icon: ClipboardCheck },
      { id: "offer_accepted", label: "Offer accepted by candidate", icon: UserCheck },
      { id: "background_check", label: "Complete background check", icon: ClipboardCheck },
    ],
    nextAction: "Start Onboarding",
  },
  onboarding: {
    title: "Onboarding Stage",
    description: "Welcome and set up new employee",
    actions: [
      { id: "paperwork", label: "Complete HR paperwork", icon: FileCheck },
      { id: "equipment", label: "Set up workstation/equipment", icon: Laptop },
      { id: "access", label: "Grant system access", icon: Key },
      { id: "orientation", label: "Complete orientation", icon: GraduationCap },
      { id: "team_intro", label: "Team introductions", icon: UserCheck },
    ],
    nextAction: "Move to Probation",
  },
  probation: {
    title: "Probation Stage",
    description: "Initial performance evaluation period",
    actions: [
      { id: "30_day_review", label: "30-day check-in", icon: Calendar },
      { id: "60_day_review", label: "60-day performance review", icon: ClipboardCheck },
      { id: "training_complete", label: "Complete required training", icon: GraduationCap },
      { id: "90_day_review", label: "90-day final review", icon: Target },
    ],
    nextAction: "Confirm as Active",
  },
  active: {
    title: "Active Employment",
    description: "Regular employee status",
    actions: [
      { id: "goals_set", label: "Annual goals established", icon: Target },
      { id: "benefits_enrolled", label: "Benefits enrollment complete", icon: Heart },
      { id: "development_plan", label: "Create development plan", icon: GraduationCap },
    ],
    nextAction: "Move to Development",
  },
  development: {
    title: "Development Stage",
    description: "Career growth and advancement",
    actions: [
      { id: "performance_review", label: "Annual performance review", icon: ClipboardCheck },
      { id: "skills_training", label: "Skills development training", icon: GraduationCap },
      { id: "career_planning", label: "Career path discussion", icon: Target },
      { id: "promotion_review", label: "Promotion eligibility review", icon: UserCheck },
    ],
    nextAction: "Continue Development",
  },
};

interface EmployeeStageActionsProps {
  stage: string;
  completedActions: string[];
  onActionToggle: (actionId: string) => void;
  onAdvanceStage: () => void;
  onTerminate: () => void;
  isReadOnly?: boolean;
}

export function EmployeeStageActions({
  stage,
  completedActions,
  onActionToggle,
  onAdvanceStage,
  onTerminate,
  isReadOnly = false,
}: EmployeeStageActionsProps) {
  const config = stageConfigs[stage];

  if (!config) return null;

  const allActionsCompleted = config.actions.every((action) =>
    completedActions.includes(action.id)
  );

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
            {config.actions.filter((a) => completedActions.includes(a.id)).length}
            /{config.actions.length}
          </span>
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {config.actions.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            const Icon = action.icon;

            return (
              <div
                key={action.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  isCompleted
                    ? "bg-success/5 border-success/20"
                    : "bg-muted/50 border-border hover:bg-muted"
                )}
              >
                <Checkbox
                  id={action.id}
                  checked={isCompleted}
                  onCheckedChange={() => !isReadOnly && onActionToggle(action.id)}
                  disabled={isReadOnly}
                />
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isCompleted ? "text-success" : "text-muted-foreground"
                  )}
                />
                <Label
                  htmlFor={action.id}
                  className={cn(
                    "flex-1 cursor-pointer",
                    isCompleted && "line-through text-muted-foreground"
                  )}
                >
                  {action.label}
                </Label>
              </div>
            );
          })}
        </div>

        {!isReadOnly && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onAdvanceStage}
              disabled={!allActionsCompleted}
              className="flex-1"
            >
              {config.nextAction}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onTerminate}
              className="text-destructive hover:text-destructive"
            >
              <UserX className="mr-2 h-4 w-4" />
              Terminate
            </Button>
          </div>
        )}

        {!allActionsCompleted && !isReadOnly && (
          <p className="text-xs text-muted-foreground text-center">
            Complete all actions to advance to the next stage
          </p>
        )}
      </CardContent>
    </Card>
  );
}
