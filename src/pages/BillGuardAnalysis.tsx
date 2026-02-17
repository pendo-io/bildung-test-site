import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, MessageSquare, CheckCircle2, Sparkles, Loader2, Clock, Copy, Check } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { ChatPanel } from "@/components/bill-guard/ChatPanel";

type Intent = "prevent" | "explain" | "intervene";

interface InvoiceData {
  source_metrics: {
    invoice_id: string;
    billed_weight: number;
    rated_weight: number;
    weight_diff: number;
    auto_correct_allowed: boolean;
    dispute_rate: number;
    confidence_score: number;
    recommended_intent: Intent;
  };
  agent_json: {
    agent_json: {
      customer_message: string;
      intent: Intent;
      requires_human_approval: boolean;
    };
    invoice_id: string;
    model_used: string;
  };
  execution_steps: { label: string; status: "done" | "pending" | "waiting" }[];
  recommendation: {
    title: string;
    message: string;
    intent: Intent;
  };
}

const invoiceDatabase: Record<string, InvoiceData> = {
  "INV-LOW-001": {
    source_metrics: {
      invoice_id: "INV-LOW-001",
      billed_weight: 102.0,
      rated_weight: 101.0,
      weight_diff: 1.0,
      auto_correct_allowed: true,
      dispute_rate: 0.03,
      confidence_score: 90,
      recommended_intent: "prevent",
    },
    agent_json: {
      agent_json: {
        customer_message: "Payment is released immediately",
        intent: "prevent",
        requires_human_approval: false,
      },
      invoice_id: "INV-LOW-001",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) No approval required", status: "done" },
      { label: "4) Evidence logged (agent)", status: "done" },
    ],
    recommendation: {
      title: "PREVENT RECOMMENDED",
      message: "Payment is released immediately",
      intent: "prevent",
    },
  },
  "INV-UPS-999-G": {
    source_metrics: {
      invoice_id: "INV-UPS-999-G",
      billed_weight: 500.8,
      rated_weight: 500.0,
      weight_diff: 0.8,
      auto_correct_allowed: true,
      dispute_rate: 0.01,
      confidence_score: 90,
      recommended_intent: "prevent",
    },
    agent_json: {
      agent_json: {
        customer_message: "Payment is released immediately",
        intent: "prevent",
        requires_human_approval: false,
      },
      invoice_id: "INV-UPS-999-G",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) No approval required", status: "done" },
      { label: "4) Evidence logged (confidence)", status: "done" },
    ],
    recommendation: {
      title: "PREVENT RECOMMENDED",
      message: "Payment is released immediately",
      intent: "prevent",
    },
  },
  "INV-MED-003": {
    source_metrics: {
      invoice_id: "INV-MED-003",
      billed_weight: 101.0,
      rated_weight: 100.0,
      weight_diff: 1.0,
      auto_correct_allowed: true,
      dispute_rate: 0.07,
      confidence_score: 90,
      recommended_intent: "explain",
    },
    agent_json: {
      agent_json: {
        customer_message: "Weight variance explained based on historical patterns and data.",
        intent: "explain",
        requires_human_approval: false,
      },
      invoice_id: "INV-MED-003",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) No approval (proactive explain)", status: "done" },
      { label: "4) Evidence logged (agent)", status: "done" },
    ],
    recommendation: {
      title: "EXPLAIN RECOMMENDED",
      message: "Weight variance explained based on historical patterns and data.",
      intent: "explain",
    },
  },
  "INV-UPS-888-A": {
    source_metrics: {
      invoice_id: "INV-UPS-888-A",
      billed_weight: 100.4,
      rated_weight: 100.0,
      weight_diff: 0.4,
      auto_correct_allowed: true,
      dispute_rate: 0.08,
      confidence_score: 90,
      recommended_intent: "explain",
    },
    agent_json: {
      agent_json: {
        customer_message: "Weight variance explained based on historical patterns and data.",
        intent: "explain",
        requires_human_approval: false,
      },
      invoice_id: "INV-UPS-888-A",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) No approval (proactive explain)", status: "done" },
      { label: "4) Evidence logged (confidence)", status: "done" },
    ],
    recommendation: {
      title: "EXPLAIN RECOMMENDED",
      message: "Weight variance explained based on historical patterns and data.",
      intent: "explain",
    },
  },
  "INV-HIGH-002": {
    source_metrics: {
      invoice_id: "INV-HIGH-002",
      billed_weight: 180.0,
      rated_weight: 120.0,
      weight_diff: 60.0,
      auto_correct_allowed: false,
      dispute_rate: 0.12,
      confidence_score: 40,
      recommended_intent: "intervene",
    },
    agent_json: {
      agent_json: {
        customer_message: "Human review is required",
        intent: "intervene",
        requires_human_approval: true,
      },
      invoice_id: "INV-HIGH-002",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) Approval required", status: "done" },
      { label: "4) Evidence logged (agent)", status: "done" },
    ],
    recommendation: {
      title: "INTERVENE RECOMMENDED",
      message: "Human review is required",
      intent: "intervene",
    },
  },
  "INV-UPS-777-F": {
    source_metrics: {
      invoice_id: "INV-UPS-777-F",
      billed_weight: 1250.0,
      rated_weight: 1100.0,
      weight_diff: 150.0,
      auto_correct_allowed: false,
      dispute_rate: 0.12,
      confidence_score: 40,
      recommended_intent: "intervene",
    },
    agent_json: {
      agent_json: {
        customer_message: "Human review is required",
        intent: "intervene",
        requires_human_approval: true,
      },
      invoice_id: "INV-UPS-777-F",
      model_used: "gemini-2.0-flash",
    },
    execution_steps: [
      { label: "1) Confidence certified", status: "done" },
      { label: "2) Agent intent selected", status: "done" },
      { label: "3) Approval required", status: "done" },
      { label: "4) Evidence logged (agent)", status: "done" },
    ],
    recommendation: {
      title: "INTERVENE RECOMMENDED",
      message: "Human review is required",
      intent: "intervene",
    },
  },
};

const scenarioLegend = [
  { id: "INV-LOW-001", risk: "High Confidence:", description: "Minor variance. AI auto-corrects to", action: "Prevent", extra: " dispute.", type: "green" as const },
  { id: "INV-UPS-999-G", risk: "High Confidence:", description: "Minor variance. AI auto-corrects to", action: "Prevent", extra: " dispute.", type: "green" as const },
  { id: "INV-MED-003", risk: "Edge Case:", description: "Moderate variance. AI", action: "Explains", extra: " logic to vendor.", type: "amber" as const },
  { id: "INV-UPS-888-A", risk: "Edge Case:", description: "Moderate variance. AI", action: "Explains", extra: " logic to vendor.", type: "amber" as const },
  { id: "INV-HIGH-002", risk: "High Risk:", description: "Major discrepancy. AI must", action: "Intervene", extra: " for human gate.", type: "red" as const },
  { id: "INV-UPS-777-F", risk: "High Risk:", description: "Major discrepancy. AI must", action: "Intervene", extra: " for human gate.", type: "red" as const },
];

const intentColors: Record<Intent, { bg: string; border: string; text: string; textLight: string }> = {
  prevent: { bg: "bg-blue-50", border: "border-blue-500", text: "text-green-700", textLight: "text-green-600" },
  explain: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", textLight: "text-amber-600" },
  intervene: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", textLight: "text-red-600" },
};

const intentCardColors: Record<Intent, { border: string; bg: string; titleText: string }> = {
  prevent: { border: "border-green-400", bg: "bg-green-50", titleText: "text-green-800" },
  explain: { border: "border-amber-400", bg: "bg-amber-50", titleText: "text-amber-800" },
  intervene: { border: "border-red-400", bg: "bg-red-50", titleText: "text-red-800" },
};

export default function BillGuardAnalysis() {
  const [invoiceId, setInvoiceId] = useState("");
  const [analysisResult, setAnalysisResult] = useState<InvoiceData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const handleAnalyze = () => {
    const trimmed = invoiceId.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Please enter an invoice ID");
      return;
    }
    const data = invoiceDatabase[trimmed];
    if (!data) {
      toast.error(`Invoice "${trimmed}" not found. Try one from the Scenario Legend.`);
      return;
    }
    clearTimers();
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCompletedSteps(0);
    setShowTimeline(true);

    // Animate each step sequentially
    const stepCount = data.execution_steps.length;
    const stepDelay = 600;
    for (let i = 0; i < stepCount; i++) {
      const t = setTimeout(() => setCompletedSteps(i + 1), stepDelay * (i + 1));
      timersRef.current.push(t);
    }
    // Show full results after all steps complete
    const finalDelay = stepDelay * (stepCount + 1);
    const t = setTimeout(() => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
    }, finalDelay);
    timersRef.current.push(t);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setInvoiceId(id);
    setCopiedId(id);
    toast.success(`Copied ${id} to input`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const result = analysisResult;
  const intent = result?.recommendation.intent;
  const recColors = intent ? intentColors[intent] : null;
  const cardColors = intent ? intentCardColors[intent] : null;

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
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter invoice ID (e.g. INV-LOW-001)"
              className="pr-10"
            />
            <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Analyzing...</> : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {/* Scenario Legend - clickable IDs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Scenario Legend: <span className="text-sm font-normal text-muted-foreground">(click an ID to copy)</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenarioLegend.map((item) => (
              <div key={item.id} className="flex items-start gap-8">
                <button
                  onClick={() => handleCopyId(item.id)}
                  className="font-medium text-sm w-36 shrink-0 text-left hover:underline flex items-center gap-1.5 text-blue-700 cursor-pointer"
                  title={`Click to copy ${item.id}`}
                >
                  {copiedId === item.id ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 opacity-50" />
                  )}
                  {item.id}
                </button>
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
                  {item.extra}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution Timeline - shows during analysis with progressive steps */}
      {showTimeline && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Execution Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {(result?.execution_steps ?? invoiceDatabase[invoiceId.trim().toUpperCase()]?.execution_steps ?? []).map((step, i) => {
                const isDone = i < completedSteps;
                const activeIntent = result?.recommendation.intent ?? invoiceDatabase[invoiceId.trim().toUpperCase()]?.recommendation.intent;
                return (
                  <Badge
                    key={i}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-500 ${
                      isDone
                        ? activeIntent === "intervene"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : activeIntent === "explain"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-300"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    ) : (
                      <Clock className="h-4 w-4 mr-1.5 animate-pulse" />
                    )}
                    {step.label}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isAnalyzing && (
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center p-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground font-medium">Agent analyzing invoice...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <>
          {/* Recommendation Banner */}
          {recColors && (
            <div className={`mb-6 border-l-4 ${recColors.border} ${recColors.bg} rounded-r-lg p-5`}>
              <h3 className={`text-lg font-bold ${recColors.text} uppercase`}>{result.recommendation.title}</h3>
              <p className={`${recColors.textLight} text-sm`}>{result.recommendation.message}</p>
            </div>
          )}

          {/* Agent Intelligence */}
          {cardColors && (
            <Card className={`mb-6 border-2 ${cardColors.border} ${cardColors.bg}`}>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle className={`text-lg ${cardColors.titleText}`}>Agent Intelligence</CardTitle>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-4 w-4" /> Powered by <strong>{result.agent_json.model_used}</strong>
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                  {JSON.stringify(result.agent_json, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Source Metrics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Source Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-green-100 text-gray-800 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                {JSON.stringify(result.source_metrics, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
      <ChatPanel />
    </AppLayout>
  );
}
