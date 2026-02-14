import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, MessageSquare, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

const scenarioLegend = [
  { id: "INV-LOW-001", risk: "High Confidence:", description: "Minor variance. AI auto-corrects to", action: "Prevent", actionStyle: "font-bold", type: "green" },
  { id: "INV-UPS-999-G", risk: "High Confidence:", description: "Minor variance. AI auto-corrects to", action: "Prevent", actionStyle: "font-bold", type: "green" },
  { id: "INV-MED-003", risk: "Edge Case:", description: "Moderate variance. AI", action: "Explains", actionStyle: "font-bold", extra: " logic to vendor.", type: "amber" },
  { id: "INV-UPS-888-A", risk: "Edge Case:", description: "Moderate variance. AI", action: "Explains", actionStyle: "font-bold", extra: " logic to vendor.", type: "amber" },
  { id: "INV-HIGH-002", risk: "High Risk:", description: "Major discrepancy. AI must", action: "Intervene", actionStyle: "font-bold", extra: " for human gate.", type: "red" },
  { id: "INV-UPS-777-F", risk: "High Risk:", description: "Major discrepancy. AI must", action: "Intervene", actionStyle: "font-bold", extra: " for human gate.", type: "red" },
];

const executionSteps = [
  "1) Confidence certified",
  "2) Agent intent selected",
  "3) No approval required",
  "4) Evidence logged (agent)",
];

const agentJson = `{
  "agent_json": {
    "customer_message": "Payment is released immediately",
    "intent": "prevent",
    "requires_human_approval": false
  },
  "invoice_id": "INV-LOW-001",
  "model_used": "gemini-2.0-flash"
}`;

const sourceMetrics = `{
  "invoice_id": "INV-LOW-001",
  "billed_weight": 102.0,
  "rated_weight": 101.0,
  "weight_diff": 1.0,
  "auto_correct_allowed": true,
  "dispute_rate": 0.03,
  "confidence_score": 90,
  "recommended_intent": "prevent"
}`;

export default function BillGuardAnalysis() {
  const [invoiceId, setInvoiceId] = useState("INV-LOW-001");

  return (
    <AppLayout title="Bill Guard Analysis" subtitle="AI-powered invoice dispute analysis">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-7 w-7 text-destructive" />
        <h2 className="text-2xl font-bold text-green-600">Intelligent Bill Guard</h2>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative flex-shrink-0 w-72">
            <Input
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="pr-10"
            />
            <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Analyze</Button>
        </CardContent>
      </Card>

      {/* Scenario Legend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Scenario Legend:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenarioLegend.map((item) => (
              <div key={item.id} className="flex items-start gap-8">
                <span className="font-medium text-sm w-36 shrink-0">{item.id}</span>
                <span className="text-sm">
                  <span className={
                    item.type === "green" ? "text-green-600 font-semibold" :
                    item.type === "amber" ? "text-amber-600 font-semibold" :
                    "text-red-600 font-semibold"
                  }>
                    {item.risk}
                  </span>{" "}
                  {item.description}{" "}
                  <span className="font-bold">{item.action}</span>
                  {item.extra ? <span>{item.extra}</span> : " dispute."}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Execution Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {executionSteps.map((step, i) => (
              <Badge
                key={i}
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  i % 2 === 0
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                {step}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prevent Recommended */}
      <div className="mb-6 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-5">
        <h3 className="text-lg font-bold text-green-700 uppercase">Prevent Recommended</h3>
        <p className="text-green-600 text-sm">Payment is released immediately</p>
      </div>

      {/* Agent Intelligence */}
      <Card className="mb-6 border-2 border-green-400 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-lg text-green-800">Agent Intelligence</CardTitle>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> Powered by <strong>gemini-2.0-flash</strong>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            {agentJson}
          </pre>
        </CardContent>
      </Card>

      {/* Source Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Source Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-green-100 text-gray-800 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            {sourceMetrics}
          </pre>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
