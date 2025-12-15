import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { OpportunityStageProgress } from "@/components/lead-to-cash/OpportunityStageProgress";
import { StageActions } from "@/components/lead-to-cash/StageActions";
import { CloseOpportunityDialog } from "@/components/lead-to-cash/CloseOpportunityDialog";
import { ActivityTimeline, Activity } from "@/components/lead-to-cash/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Trophy,
  XCircle,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - in real app this would come from database
const mockOpportunity = {
  id: "OPP-2024-456",
  company: "Acme Corporation",
  contactName: "John Smith",
  contactEmail: "john@acme.com",
  contactPhone: "+1 (555) 123-4567",
  value: 2400000,
  stage: "negotiation",
  source: "referral",
  description: "Enterprise shipping contract for nationwide logistics operations",
  expectedCloseDate: "2024-12-30",
  createdAt: "2024-11-15",
  owner: "Sarah Johnson",
  probability: 75,
  isWon: false,
  isLost: false,
};

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "stage_change",
    title: "Moved to Negotiation stage",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
  },
  {
    id: "2",
    type: "call",
    title: "Contract terms discussion",
    description: "Discussed pricing adjustments and delivery schedules",
    timestamp: "1 day ago",
    user: "Sarah Johnson",
  },
  {
    id: "3",
    type: "email",
    title: "Sent revised proposal",
    description: "Updated proposal with volume discounts",
    timestamp: "3 days ago",
    user: "Sarah Johnson",
  },
  {
    id: "4",
    type: "meeting",
    title: "Executive presentation",
    description: "Presented solution to C-suite stakeholders",
    timestamp: "1 week ago",
    user: "Sarah Johnson",
  },
];

const stages = ["lead", "qualification", "discovery", "proposal", "negotiation", "closed"];

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [opportunity, setOpportunity] = useState(mockOpportunity);
  const [completedActions, setCompletedActions] = useState<string[]>([
    "terms_discuss",
    "legal_review",
  ]);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const handleActionToggle = (actionId: string) => {
    setCompletedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleAdvanceStage = () => {
    const currentIndex = stages.indexOf(opportunity.stage);
    if (currentIndex < stages.length - 2) {
      const nextStage = stages[currentIndex + 1];
      setOpportunity((prev) => ({ ...prev, stage: nextStage }));
      setCompletedActions([]);
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: "stage_change",
        title: `Moved to ${nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} stage`,
        timestamp: "Just now",
        user: opportunity.owner,
      };
      setActivities((prev) => [newActivity, ...prev]);

      toast({
        title: "Stage Updated",
        description: `Opportunity moved to ${nextStage} stage`,
      });
    } else {
      setShowCloseDialog(true);
    }
  };

  const handleMarkLost = () => {
    setShowCloseDialog(true);
  };

  const handleClose = (data: any) => {
    setOpportunity((prev) => ({
      ...prev,
      isWon: data.outcome === "won",
      isLost: data.outcome === "lost",
      stage: data.outcome === "won" ? "closed" : prev.stage,
      value: data.finalValue || prev.value,
    }));

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: data.outcome === "won" ? "task" : "note",
      title: data.outcome === "won" ? "Deal Closed Won!" : "Deal Marked as Lost",
      description: data.notes,
      timestamp: "Just now",
      user: opportunity.owner,
    };
    setActivities((prev) => [newActivity, ...prev]);

    toast({
      title: data.outcome === "won" ? "Congratulations!" : "Opportunity Closed",
      description:
        data.outcome === "won"
          ? `Deal worth $${(data.finalValue || opportunity.value).toLocaleString()} has been closed!`
          : "Opportunity has been marked as lost.",
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <AppLayout title="Opportunity Details" subtitle={opportunity.id}>
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/lead-to-cash")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Pipeline
      </Button>

      {/* Status Banner */}
      {(opportunity.isWon || opportunity.isLost) && (
        <div
          className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-4",
            opportunity.isWon && "bg-success/10 border border-success/20",
            opportunity.isLost && "bg-destructive/10 border border-destructive/20"
          )}
        >
          {opportunity.isWon ? (
            <>
              <Trophy className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold text-success">Deal Won!</h3>
                <p className="text-sm text-success/80">
                  Closed for {formatCurrency(opportunity.value)}
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Deal Lost</h3>
                <p className="text-sm text-destructive/80">
                  This opportunity has been marked as lost
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Stage Progress */}
      <Card className="mb-8 card-elevated">
        <CardHeader>
          <CardTitle>Deal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <OpportunityStageProgress
            currentStage={opportunity.stage}
            isWon={opportunity.isWon}
            isLost={opportunity.isLost}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Details */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Opportunity Details</CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{opportunity.company}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{opportunity.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{opportunity.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{opportunity.contactPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deal Value</p>
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(opportunity.value)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Close</p>
                      <p className="font-medium">{opportunity.expectedCloseDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Owner</p>
                    <Badge variant="secondary">{opportunity.owner}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Source</p>
                    <Badge variant="outline" className="capitalize">
                      {opportunity.source}
                    </Badge>
                  </div>
                </div>
              </div>

              {opportunity.description && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-card-foreground">{opportunity.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stage Actions */}
          {!opportunity.isWon && !opportunity.isLost && (
            <StageActions
              stage={opportunity.stage}
              completedActions={completedActions}
              onActionToggle={handleActionToggle}
              onAdvanceStage={handleAdvanceStage}
              onMarkLost={handleMarkLost}
            />
          )}
        </div>

        {/* Right Column - Activity Timeline */}
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Close Dialog */}
      <CloseOpportunityDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        opportunityName={opportunity.company}
        dealValue={opportunity.value}
        onClose={handleClose}
      />
    </AppLayout>
  );
}
