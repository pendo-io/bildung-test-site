import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloseOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunityName: string;
  dealValue: number;
  onClose: (data: CloseData) => void;
}

interface CloseData {
  outcome: "won" | "lost";
  finalValue?: number;
  lostReason?: string;
  notes?: string;
  contractDate?: string;
}

const lostReasons = [
  { value: "price", label: "Price too high" },
  { value: "competitor", label: "Lost to competitor" },
  { value: "budget", label: "Budget constraints" },
  { value: "timing", label: "Bad timing" },
  { value: "no-decision", label: "No decision made" },
  { value: "requirements", label: "Requirements not met" },
  { value: "other", label: "Other" },
];

export function CloseOpportunityDialog({
  open,
  onOpenChange,
  opportunityName,
  dealValue,
  onClose,
}: CloseOpportunityDialogProps) {
  const [outcome, setOutcome] = useState<"won" | "lost">("won");
  const [finalValue, setFinalValue] = useState(dealValue.toString());
  const [lostReason, setLostReason] = useState("");
  const [notes, setNotes] = useState("");
  const [contractDate, setContractDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose({
      outcome,
      finalValue: outcome === "won" ? parseFloat(finalValue) : undefined,
      lostReason: outcome === "lost" ? lostReason : undefined,
      notes,
      contractDate: outcome === "won" ? contractDate : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Close Opportunity</DialogTitle>
          <DialogDescription>
            Record the final outcome for {opportunityName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outcome Selection */}
          <RadioGroup
            value={outcome}
            onValueChange={(v) => setOutcome(v as "won" | "lost")}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="won"
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all",
                outcome === "won"
                  ? "border-success bg-success/5"
                  : "border-border hover:border-success/50"
              )}
            >
              <RadioGroupItem value="won" id="won" className="sr-only" />
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  outcome === "won" ? "bg-success text-success-foreground" : "bg-muted"
                )}
              >
                <Trophy className="h-6 w-6" />
              </div>
              <span className="font-semibold">Closed Won</span>
            </Label>

            <Label
              htmlFor="lost"
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all",
                outcome === "lost"
                  ? "border-destructive bg-destructive/5"
                  : "border-border hover:border-destructive/50"
              )}
            >
              <RadioGroupItem value="lost" id="lost" className="sr-only" />
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  outcome === "lost"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted"
                )}
              >
                <XCircle className="h-6 w-6" />
              </div>
              <span className="font-semibold">Closed Lost</span>
            </Label>
          </RadioGroup>

          {/* Won Fields */}
          {outcome === "won" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="finalValue">Final Contract Value ($)</Label>
                <Input
                  id="finalValue"
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contractDate">Contract Signed Date</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={contractDate}
                  onChange={(e) => setContractDate(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Lost Fields */}
          {outcome === "lost" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="lostReason">Reason for Loss</Label>
                <Select value={lostReason} onValueChange={setLostReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {lostReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about the outcome..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                outcome === "won" && "bg-success hover:bg-success/90",
                outcome === "lost" && "bg-destructive hover:bg-destructive/90"
              )}
            >
              {outcome === "won" ? "Mark as Won" : "Mark as Lost"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
