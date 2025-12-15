import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AddOpportunityDialog } from "@/components/lead-to-cash/AddOpportunityDialog";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const initialOpportunities = [
  {
    id: "OPP-2024-456",
    company: "Acme Corporation",
    value: "$2.4M",
    valueNum: 2400000,
    stage: "Negotiation",
    probability: 75,
    owner: "John Smith",
  },
  {
    id: "OPP-2024-455",
    company: "Global Enterprises",
    value: "$1.8M",
    valueNum: 1800000,
    stage: "Proposal",
    probability: 50,
    owner: "Sarah Johnson",
  },
  {
    id: "OPP-2024-454",
    company: "Tech Innovators",
    value: "$950K",
    valueNum: 950000,
    stage: "Discovery",
    probability: 25,
    owner: "Mike Chen",
  },
  {
    id: "OPP-2024-453",
    company: "Retail Giants Inc",
    value: "$3.2M",
    valueNum: 3200000,
    stage: "Qualification",
    probability: 40,
    owner: "Emily Davis",
  },
];

const pipelineStages = [
  { name: "Lead", count: 456, value: "$12.4M", color: "bg-chart-4" },
  { name: "Qualification", count: 234, value: "$8.2M", color: "bg-chart-1" },
  { name: "Discovery", count: 145, value: "$5.6M", color: "bg-chart-2" },
  { name: "Proposal", count: 89, value: "$4.1M", color: "bg-chart-3" },
  { name: "Negotiation", count: 34, value: "$2.8M", color: "bg-success" },
];

export default function LeadToCash() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [opportunities, setOpportunities] = useState(initialOpportunities);

  const handleAddOpportunity = (newOpp: any) => {
    const formattedValue = newOpp.value >= 1000000 
      ? `$${(newOpp.value / 1000000).toFixed(1)}M`
      : `$${(newOpp.value / 1000).toFixed(0)}K`;
    
    setOpportunities(prev => [{
      ...newOpp,
      value: formattedValue,
      valueNum: newOpp.value,
      stage: newOpp.stage.charAt(0).toUpperCase() + newOpp.stage.slice(1),
    }, ...prev]);
  };

  return (
    <AppLayout
      title="Lead to Cash"
      subtitle="Track your sales pipeline and revenue operations"
    >
      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Pipeline Value"
          value="$8.4M"
          change={{ value: "+15.2%", trend: "up" }}
          icon={DollarSign}
          variant="accent"
        />
        <MetricCard
          title="Active Leads"
          value="1,456"
          change={{ value: "+89", trend: "up" }}
          icon={Users}
        />
        <MetricCard
          title="Win Rate"
          value="34%"
          change={{ value: "+2.4%", trend: "up" }}
          icon={Target}
          variant="primary"
        />
        <MetricCard
          title="Avg Deal Size"
          value="$245K"
          change={{ value: "+$18K", trend: "up" }}
          icon={TrendingUp}
        />
      </div>

      {/* Pipeline Funnel */}
      <div className="rounded-xl border border-border bg-card p-6 card-elevated mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Sales Pipeline
            </h3>
            <p className="text-sm text-muted-foreground">
              Opportunity stages and conversion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pipelineStages.map((stage, index) => (
            <div key={stage.name} className="flex-1 group">
              <div className="flex items-center">
                <div className="flex-1">
                  <div
                    className={`h-16 rounded-lg ${stage.color} flex items-center justify-center transition-transform group-hover:scale-105`}
                  >
                    <div className="text-center">
                      <p className="text-xl font-bold text-primary-foreground">
                        {stage.count}
                      </p>
                      <p className="text-xs text-primary-foreground/80">
                        {stage.value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-center text-card-foreground">
                    {stage.name}
                  </p>
                </div>
                {index < pipelineStages.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="rounded-xl border border-border bg-card p-6 card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Top Opportunities
            </h3>
            <p className="text-sm text-muted-foreground">
              High-value deals in progress
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>Add Opportunity</Button>
        </div>

        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              onClick={() => navigate(`/lead-to-cash/opportunity/${opp.id}`)}
              className="flex items-center gap-6 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-card-foreground">
                    {opp.company}
                  </h4>
                  <span className="text-sm text-muted-foreground">{opp.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Owner: {opp.owner} • Stage: {opp.stage}
                </p>
              </div>
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Probability
                  </span>
                  <span className="text-xs font-medium text-card-foreground">
                    {opp.probability}%
                  </span>
                </div>
                <Progress value={opp.probability} className="h-2" />
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-card-foreground">
                  {opp.value}
                </p>
                <p className="text-xs text-muted-foreground">Deal Value</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Opportunity Dialog */}
      <AddOpportunityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddOpportunity}
      />
    </AppLayout>
  );
}
