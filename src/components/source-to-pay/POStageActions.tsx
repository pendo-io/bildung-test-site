import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FileCheck,
  ClipboardCheck,
  Send,
  Truck,
  Package,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  X,
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
  requested: {
    title: "Request Stage",
    description: "Purchase order submitted for approval",
    actions: [
      { id: "verify_budget", label: "Verify budget availability", icon: FileCheck },
      { id: "check_vendor", label: "Confirm vendor details", icon: ClipboardCheck },
      { id: "review_specs", label: "Review specifications", icon: CheckCircle2 },
    ],
    nextAction: "Approve PO",
  },
  approved: {
    title: "Approval Stage",
    description: "PO approved, ready to place order",
    actions: [
      { id: "final_review", label: "Final manager review", icon: ClipboardCheck },
      { id: "confirm_terms", label: "Confirm terms with vendor", icon: FileCheck },
      { id: "send_po", label: "Send PO to vendor", icon: Send },
    ],
    nextAction: "Mark as Ordered",
  },
  ordered: {
    title: "Order Stage",
    description: "Order placed with vendor",
    actions: [
      { id: "confirm_order", label: "Order confirmation received", icon: CheckCircle2 },
      { id: "track_shipment", label: "Track shipment status", icon: Truck },
      { id: "notify_warehouse", label: "Notify receiving warehouse", icon: Package },
    ],
    nextAction: "Mark as Shipped",
  },
  shipped: {
    title: "Shipping Stage",
    description: "Order in transit",
    actions: [
      { id: "tracking_update", label: "Update tracking information", icon: Truck },
      { id: "eta_confirm", label: "Confirm ETA with warehouse", icon: ClipboardCheck },
      { id: "prep_receiving", label: "Prepare for receiving", icon: Package },
    ],
    nextAction: "Confirm Receipt",
  },
  received: {
    title: "Receiving Stage",
    description: "Goods received at warehouse",
    actions: [
      { id: "inspect_goods", label: "Inspect received goods", icon: ClipboardCheck },
      { id: "match_po", label: "Match to purchase order", icon: FileCheck },
      { id: "process_invoice", label: "Process vendor invoice", icon: CreditCard },
      { id: "approve_payment", label: "Approve for payment", icon: CheckCircle2 },
    ],
    nextAction: "Complete Payment",
  },
};

interface POStageActionsProps {
  stage: string;
  completedActions: string[];
  onActionToggle: (actionId: string) => void;
  onAdvanceStage: () => void;
  onCancel: () => void;
  isReadOnly?: boolean;
}

export function POStageActions({
  stage,
  completedActions,
  onActionToggle,
  onAdvanceStage,
  onCancel,
  isReadOnly = false,
}: POStageActionsProps) {
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
              data-pendo-id={`advance-stage-${config.nextAction.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {config.nextAction}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-destructive hover:text-destructive"
              data-pendo-id="cancel-po"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel PO
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
