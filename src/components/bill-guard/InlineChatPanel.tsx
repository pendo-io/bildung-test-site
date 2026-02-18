import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, Loader2, Play, Square } from "lucide-react";
declare global {
  interface Window {
    pendo: any;
  }
}
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bill-guard-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (resp.status === 429) { toast.error("Rate limit exceeded. Please try again later."); onDone(); return; }
  if (resp.status === 402) { toast.error("AI credits exhausted. Please add funds."); onDone(); return; }
  if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });
    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }
  onDone();
}

const PENDO_AGENT_ID = "qzI-68_xayWnF-L8NXrPDpU5qoI";

function generateId() {
  return crypto.randomUUID();
}

function trackPendoAgent(eventType: "prompt" | "agent_response", props: {
  conversationId: string;
  messageId: string;
  content: string;
  suggestedPrompt?: boolean;
}) {
  if (window.pendo?.trackAgent) {
    console.log(`[Pendo trackAgent] eventType="${eventType}"`, {
      agentId: PENDO_AGENT_ID,
      conversationId: props.conversationId,
      messageId: props.messageId,
      contentLength: props.content.length,
    });
    window.pendo.trackAgent(eventType, {
      agentId: PENDO_AGENT_ID,
      conversationId: props.conversationId,
      messageId: props.messageId,
      content: props.content,
      modelUsed: "gemini-3-flash-preview",
      suggestedPrompt: props.suggestedPrompt ?? false,
      toolsUsed: eventType === "agent_response" ? ["knowledge_base"] : [],
      fileUploaded: false,
    });
  } else {
    console.warn("[Pendo trackAgent] window.pendo.trackAgent is NOT available", {
      pendoExists: !!window.pendo,
      trackAgentExists: !!window.pendo?.trackAgent,
    });
  }
}

const SUGGESTIONS = [
  "What's the difference between prevent, explain, and intervene?",
  "When should I dispute a weight variance?",
  "How does the confidence score work?",
];

const DEMO_PROMPTS = [
  "What is BillGuard and how does it help with invoice disputes?",
  "Explain how the confidence score determines the recommended action.",
  "When should a human intervene vs letting AI auto-correct?",
  "What are the best practices for reducing freight billing errors?",
  "How does the weight variance threshold affect dispute decisions?",
  "What happens when auto-correct is not allowed on an invoice?",
  "Can you explain the difference between billed weight and rated weight?",
  "What role does the dispute rate play in the AI recommendation?",
  "How does BillGuard handle high-risk invoices differently?",
  "What evidence does the agent log for each decision?",
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickRandomPrompts(count: number): string[] {
  const shuffled = shuffleArray(DEMO_PROMPTS);
  return shuffled.slice(0, count);
}

import { useUser } from "@/contexts/UserContext";

interface InlineChatPanelProps {
  onAnalyze?: () => void;
}

export function InlineChatPanel({ onAnalyze }: InlineChatPanelProps) {
  const { refreshUser } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>(generateId());

  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const autoDemoRef = useRef(false);
  const demoIndexRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(async (text: string, allMessages?: Msg[], skipAnalyze?: boolean) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    // Trigger analyze before each prompt (unless skipped, e.g. from demo which handles it separately)
    if (!skipAnalyze && onAnalyze) onAnalyze();
    const userMsg: Msg = { role: "user", content: trimmed };
    const currentMessages = allMessages ?? messages;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const promptMessageId = generateId();
    const isSuggested = SUGGESTIONS.includes(trimmed) || DEMO_PROMPTS.includes(trimmed);
    trackPendoAgent("prompt", {
      conversationId: conversationIdRef.current,
      messageId: promptMessageId,
      content: trimmed,
      suggestedPrompt: isSuggested,
    });

    let assistantSoFar = "";
    const responseMessageId = generateId();
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...currentMessages, userMsg],
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => {
          setIsLoading(false);
          trackPendoAgent("agent_response", {
            conversationId: conversationIdRef.current,
            messageId: responseMessageId,
            content: assistantSoFar,
            suggestedPrompt: isSuggested,
          });
        },
      });
      return [...currentMessages, userMsg, { role: "assistant" as const, content: assistantSoFar }];
    } catch (e) {
      console.error(e);
      toast.error("Failed to get response. Please try again.");
      setIsLoading(false);
      return null;
    }
  }, [messages, isLoading]);

  const startAutoDemo = useCallback(async () => {
    setIsAutoDemo(true);
    autoDemoRef.current = true;
    demoIndexRef.current = 0;
    setMessages([]);
    conversationIdRef.current = generateId();

    let currentMessages: Msg[] = [];
    while (autoDemoRef.current) {
      // Pick 2-4 random prompts each cycle
      const cyclePrompts = pickRandomPrompts(2 + Math.floor(Math.random() * 3));
      for (let i = 0; i < cyclePrompts.length; i++) {
        if (!autoDemoRef.current) break;
        demoIndexRef.current = i;
        if (currentMessages.length > 0) await new Promise((r) => setTimeout(r, 1500));
        if (!autoDemoRef.current) break;
        // Simulate clicking the Analyze button before each prompt
        if (onAnalyze) {
          onAnalyze();
          await new Promise((r) => setTimeout(r, 800));
        }
        const result = await send(cyclePrompts[i], currentMessages, true);
        if (result) {
          currentMessages = result;
        } else {
          autoDemoRef.current = false;
          break;
        }
      }
      // Pause, refresh visitor identity, clear chat for next cycle
      if (autoDemoRef.current) {
        await new Promise((r) => setTimeout(r, 2500));
        if (!autoDemoRef.current) break;
        refreshUser(); // Rotate visitor for Pendo
        setMessages([]);
        currentMessages = [];
        conversationIdRef.current = generateId();
      }
    }
    setIsAutoDemo(false);
    autoDemoRef.current = false;
  }, [send, refreshUser]);

  const stopAutoDemo = useCallback(() => {
    autoDemoRef.current = false;
    setIsAutoDemo(false);
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            BillGuard AI Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={isAutoDemo ? stopAutoDemo : startAutoDemo}
            disabled={isLoading && !isAutoDemo}
            className="h-7 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isAutoDemo ? (
              <><Square className="h-3 w-3 mr-1" /> Stop</>
            ) : (
              <><Play className="h-3 w-3 mr-1" /> Demo</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Ask about invoice disputes, weight variances, or billing analysis.
              </p>
              <div className="space-y-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-xs px-2.5 py-1.5 rounded border hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-xs ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-xs max-w-none dark:prose-invert [&_p]:text-xs [&_li]:text-xs [&_h3]:text-sm">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-2.5">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about disputes..."
              className="min-h-[38px] max-h-[80px] resize-none text-xs"
              rows={1}
            />
            <Button
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 h-[38px] w-[38px]"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
