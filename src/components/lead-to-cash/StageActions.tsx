import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  FileText, 
  Calendar, 
  Send, 
  Handshake,
  CheckCircle2,
  ArrowRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StageAction {
  id: string;
  label: string;
  icon: React.ElementType;
  completed: boolean;
}

interface StageConfig {
  title: string;
  description: string;
  actions: StageAction[];
  nextAction: string;
}

const stageConfigs: Record<string, StageConfig> = {
  lead: {
    title: "Lead Stage",
    description: "Initial contact and qualification check",
    actions: [
      { id: "initial_contact", label: "Make initial contact", icon: Phone, completed: false },
      { id: "identify_needs", label: "Identify basic needs", icon: FileText, completed: false },
      { id: "verify_budget", label: "Verify budget availability", icon: CheckCircle2, completed: false },
    ],
    nextAction: "Move to Qualification",
  },
  qualification: {
    title: "Qualification Stage",
    description: "Determine if the prospect is a good fit",
    actions: [
      { id: "decision_maker", label: "Identify decision maker", icon: Handshake, completed: false },
      { id: "timeline", label: "Establish timeline", icon: Calendar, completed: false },
      { id: "budget_confirm", label: "Confirm budget range", icon: FileText, completed: false },
      { id: "pain_points", label: "Document pain points", icon: CheckCircle2, completed: false },
    ],
    nextAction: "Move to Discovery",
  },
  discovery: {
    title: "Discovery Stage",
    description: "Deep dive into requirements and solution fit",
    actions: [
      { id: "discovery_call", label: "Conduct discovery call", icon: Phone, completed: false },
      { id: "stakeholders", label: "Map all stakeholders", icon: Handshake, completed: false },
      { id: "requirements", label: "Document requirements", icon: FileText, completed: false },
      { id: "demo_schedule", label: "Schedule product demo", icon: Calendar, completed: false },
    ],
    nextAction: "Move to Proposal",
  },
  proposal: {
    title: "Proposal Stage",
    description: "Present solution and pricing",
    actions: [
      { id: "proposal_draft", label: "Draft proposal document", icon: FileText, completed: false },
      { id: "internal_review", label: "Internal review complete", icon: CheckCircle2, completed: false },
      { id: "send_proposal", label: "Send proposal to client", icon: Send, completed: false },
      { id: "proposal_call", label: "Proposal walkthrough call", icon: Phone, completed: false },
    ],
    nextAction: "Move to Negotiation",
  },
  negotiation: {
    title: "Negotiation Stage",
    description: "Final terms and contract discussion",
    actions: [
      { id: "terms_discuss", label: "Discuss contract terms", icon: Handshake, completed: false },
      { id: "legal_review", label: "Legal review complete", icon: FileText, completed: false },
      { id: "final_pricing", label: "Finalize pricing", icon: CheckCircle2, completed: false },
      { id: "contract_send", label: "Send contract for signature", icon: Send, completed: false },
    ],
    nextAction: "Close Deal",
  },
};

interface StageActionsProps {
  stage: string;
  completedActions: string[];
  onActionToggle: (actionId: string) => void;
  onAdvanceStage: () => void;
  onMarkLost: () => void;
  isReadOnly?: boolean;
}

export function StageActions({
  stage,
  completedActions,
  onActionToggle,
  onAdvanceStage,
  onMarkLost,
  isReadOnly = false,
}: StageActionsProps) {
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
        {/* Actions Checklist */}
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

        {/* Stage Actions */}
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
            <Button variant="outline" onClick={onMarkLost} className="text-destructive hover:text-destructive">
              <X className="mr-2 h-4 w-4" />
              Mark Lost
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
