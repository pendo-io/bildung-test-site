import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AddOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (opportunity: any) => void;
}

const stages = [
  { value: "lead", label: "Lead" },
  { value: "qualification", label: "Qualification" },
  { value: "discovery", label: "Discovery" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
];

const sources = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "cold-call", label: "Cold Call" },
  { value: "trade-show", label: "Trade Show" },
  { value: "partner", label: "Partner" },
];

export function AddOpportunityDialog({
  open,
  onOpenChange,
  onAdd,
}: AddOpportunityDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    value: "",
    stage: "lead",
    source: "",
    description: "",
    expectedCloseDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOpportunity = {
      id: `OPP-2024-${Math.floor(Math.random() * 1000)}`,
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: getStageProbability(formData.stage),
      createdAt: new Date().toISOString(),
      owner: "Current User",
    };

    onAdd?.(newOpportunity);
    
    toast({
      title: "Opportunity Created",
      description: `${formData.company} has been added to your pipeline.`,
    });

    onOpenChange(false);
    setFormData({
      company: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      value: "",
      stage: "lead",
      source: "",
      description: "",
      expectedCloseDate: "",
    });

    // Navigate to the new opportunity
    navigate(`/lead-to-cash/opportunity/${newOpportunity.id}`);
  };

  const getStageProbability = (stage: string) => {
    const probabilities: Record<string, number> = {
      lead: 10,
      qualification: 25,
      discovery: 40,
      proposal: 60,
      negotiation: 80,
    };
    return probabilities[stage] || 10;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Opportunity</DialogTitle>
          <DialogDescription>
            Enter the details for the new sales opportunity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Acme Corporation"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="John Smith"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="john@acme.com"
              />
            </div>

            <div>
              <Label htmlFor="value">Deal Value ($) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                placeholder="100000"
                required
              />
            </div>

            <div>
              <Label htmlFor="stage">Initial Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData({ ...formData, stage: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Lead Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedCloseDate: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the opportunity..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Opportunity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
