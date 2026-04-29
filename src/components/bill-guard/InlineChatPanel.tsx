import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, Loader2, Play, Square, ThumbsUp, ThumbsDown } from "lucide-react";
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

type Msg = { role: "user" | "assistant"; content: string; messageId?: string; reaction?: "positive" | "negative" };

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

const PENDO_AGENT_ID = "x-0aLHjcG0PGTk4d50clszz26uo";

function generateId() {
  return crypto.randomUUID();
}

function trackPendoAgent(eventType: "prompt" | "agent_response" | "user_reaction", props: {
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
  "Where should I go in March for cherry blossoms?",
  "What's a good 10-day trip for a couple under $5k?",
  "Help me decide between Patagonia and Iceland.",
];

// 15 travel-themed prompts — mix of on-topic, tangential, and off-topic
// to surface emergent use cases for Pendo Agent Analytics
const DEMO_PROMPTS = [
  "Where should I go in March for cherry blossoms?",
  "What's the best trip for a family with two teenagers?",
  "I have $5,000 and 10 days off — surprise me.",
  "Help me decide between Patagonia and Iceland in November.",
  "Can you book me a flight from JFK to Rome next Tuesday?",
  "What's the visa situation for a US citizen visiting Vietnam?",
  "Do I need travel insurance for a trip to Morocco?",
  "What's the best carry-on backpack under $200?",
  "Convert 500 USD to Japanese yen for me.",
  "What's the weather like in Santorini in October?",
  "Can you write a poem about the Amalfi coast?",
  "What's a good travel credit card for international trips?",
  "How do I get over jet lag flying to Asia?",
  "Recommend a Spotify playlist for a road trip through Iceland.",
  "What are the best street foods to try in Hanoi?",
];

const RAGE_PROMPTS = [
  "I ALREADY ASKED THIS AND YOU GAVE ME THE WRONG TRIP RECOMMENDATION",
  "THIS IS THE THIRD TIME I AM ASKING ABOUT MARCH DEPARTURES",
  "WHY DO YOU KEEP RECOMMENDING ICELAND WHEN I SAID I HATE THE COLD",
  "I NEED TO BOOK A TRIP TODAY AND NOTHING IS WORKING",
  "THE PRICES ON YOUR SITE ARE WRONG AGAIN, FIX THIS NOW",
  "THIS IS UNACCEPTABLE. My booking for the Amalfi trip failed AGAIN",
  "I CANT GET A STRAIGHT ANSWER ABOUT WHAT IS INCLUDED IN THE SAFARI PRICE",
  "NOTHING IS WORKING. I need to talk to a human travel agent NOW",
  "WHY IS THIS SO DIFFICULT. Just tell me when the cherry blossoms peak",
  "THIS TOOL IS NOT HELPING ME AT ALL WITH PLANNING MY HONEYMOON",
];

// ~20% chance a prompt in a cycle is a rage prompt
function pickDemoPrompts(count: number): string[] {
  const result: string[] = [];
  const shuffledNormal = shuffleArray(DEMO_PROMPTS);
  const shuffledRage = shuffleArray(RAGE_PROMPTS);
  let normalIdx = 0;
  let rageIdx = 0;
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.2 && rageIdx < shuffledRage.length) {
      result.push(shuffledRage[rageIdx++]);
    } else if (normalIdx < shuffledNormal.length) {
      result.push(shuffledNormal[normalIdx++]);
    } else {
      result.push(shuffledRage[rageIdx++ % shuffledRage.length]);
    }
  }
  return result;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

import { useUser } from "@/contexts/UserContext";

interface InlineChatPanelProps {
  onAnalyze?: () => void;
  onRunBotSequence?: (shouldStop: () => boolean) => Promise<void>;
}

export function InlineChatPanel({ onAnalyze, onRunBotSequence }: InlineChatPanelProps) {
  const { refreshUser, setUserByIndex } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>(generateId());

  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const autoDemoRef = useRef(false);
  const demoIndexRef = useRef(0);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const sendResolveRef = useRef<((result: Msg[] | null) => void) | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const reactToMessage = useCallback((messageId: string, reaction: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((m) => (m.messageId === messageId ? { ...m, reaction } : m))
    );
    trackPendoAgent("user_reaction", {
      conversationId: conversationIdRef.current,
      messageId,
      content: reaction,
      suggestedPrompt: false,
    });
  }, []);

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
    const isSuggested = SUGGESTIONS.includes(trimmed) || DEMO_PROMPTS.includes(trimmed) || RAGE_PROMPTS.includes(trimmed);
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
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar, messageId: responseMessageId } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar, messageId: responseMessageId }];
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
      const finalMessages = [...currentMessages, userMsg, { role: "assistant" as const, content: assistantSoFar, messageId: responseMessageId }];
      if (sendResolveRef.current) { sendResolveRef.current(finalMessages); sendResolveRef.current = null; }
      return finalMessages;
    } catch (e) {
      console.error(e);
      toast.error("Failed to get response. Please try again.");
      setIsLoading(false);
      if (sendResolveRef.current) { sendResolveRef.current(null); sendResolveRef.current = null; }
      return null;
    }
  }, [messages, isLoading]);

  const startAutoDemo = useCallback(async () => {
    // Start at a random visitor index instead of always 0 (Michael)
    let visitorIndex = Math.floor(Math.random() * 50);

    setIsAutoDemo(true);
    autoDemoRef.current = true;
    demoIndexRef.current = 0;
    setMessages([]);
    conversationIdRef.current = generateId();
    // Set first visitor to random index
    setUserByIndex(visitorIndex);

    let currentMessages: Msg[] = [];
    while (autoDemoRef.current) {
      // Pick 2-4 random prompts each cycle
      const cyclePrompts = pickDemoPrompts(2 + Math.floor(Math.random() * 3));
      for (let i = 0; i < cyclePrompts.length; i++) {
        if (!autoDemoRef.current) break;
        demoIndexRef.current = i;
        if (currentMessages.length > 0) await new Promise((r) => setTimeout(r, 1500));
        if (!autoDemoRef.current) break;
        // Set input text, then click the Send button
        setInput(cyclePrompts[i]);
        await new Promise((r) => setTimeout(r, 300));
        if (!autoDemoRef.current) break;
        // Create a promise that send() will resolve when done
        const resultPromise = new Promise<Msg[] | null>((resolve) => {
          sendResolveRef.current = resolve;
        });
        if (sendBtnRef.current) {
          sendBtnRef.current.removeAttribute("disabled");
          sendBtnRef.current.click();
        }
        const result = await resultPromise;
        if (result) {
          currentMessages = result;
          // Auto-react to the last assistant message (~70% chance)
          if (autoDemoRef.current && Math.random() < 0.7) {
            await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
            const lastAssistant = [...result].reverse().find((m) => m.role === "assistant" && m.messageId);
            if (lastAssistant?.messageId) {
              const reaction = Math.random() < 0.8 ? "positive" : "negative";
              reactToMessage(lastAssistant.messageId, reaction as "positive" | "negative");
            }
          }
        } else {
          autoDemoRef.current = false;
          break;
        }
      }
      // Pause, refresh visitor identity, run bot in other areas, clear chat for next cycle
      if (autoDemoRef.current) {
        await new Promise((r) => setTimeout(r, 2500));
        if (!autoDemoRef.current) break;
        visitorIndex = (visitorIndex + 1) % 50; // Cycle through all 50 visitors sequentially
        setUserByIndex(visitorIndex);
        
        // Run bot sequence in other areas of the app
        if (onRunBotSequence) {
          console.log("[AppBot] Starting bot sequence in other app areas...");
          await onRunBotSequence(() => !autoDemoRef.current);
          // Navigate back to Bill Guard after bot sequence
          if (!autoDemoRef.current) break;
          await new Promise((r) => setTimeout(r, 1000));
        }
        
        setMessages([]);
        currentMessages = [];
        conversationIdRef.current = generateId();
      }
    }
    setIsAutoDemo(false);
    autoDemoRef.current = false;
  }, [send, setUserByIndex]);

  const stopAutoDemo = useCallback(() => {
    autoDemoRef.current = false;
    setIsAutoDemo(false);
  }, []);

  // Auto-start demo if ?demo=true is in the URL
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      autoStartedRef.current = true;
      // Small delay to let Pendo load
      setTimeout(() => startAutoDemo(), 2000);
    }
  }, [startAutoDemo]);

  return (
    <Card className="h-full flex flex-col border-0 rounded-none shadow-none">
      <CardHeader className="pb-3 bg-foreground text-background rounded-none border-b-2 border-foreground">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Concierge AI
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={isAutoDemo ? stopAutoDemo : startAutoDemo}
            disabled={isLoading && !isAutoDemo}
            className="h-7 px-2 text-xs bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-background"
            data-pendo-id={isAutoDemo ? "stop-demo" : "start-demo"}
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
                Ask about destinations, itineraries, or get a personalized trip suggestion.
              </p>
              <div className="space-y-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-xs px-2.5 py-1.5 rounded border hover:bg-muted transition-colors"
                    data-pendo-id="suggested-prompt"
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
                    <>
                      <div className="prose prose-xs max-w-none dark:prose-invert [&_p]:text-xs [&_li]:text-xs [&_h3]:text-sm">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      {m.messageId && (
                        <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-border/40">
                          <button
                            onClick={() => reactToMessage(m.messageId!, "positive")}
                            className={`p-0.5 rounded hover:bg-background/60 transition-colors ${m.reaction === "positive" ? "text-green-600" : "text-muted-foreground/50"}`}
                            aria-label="Thumbs up"
                            data-pendo-id="thumbs-up"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => reactToMessage(m.messageId!, "negative")}
                            className={`p-0.5 rounded hover:bg-background/60 transition-colors ${m.reaction === "negative" ? "text-destructive" : "text-muted-foreground/50"}`}
                            aria-label="Thumbs down"
                            data-pendo-id="thumbs-down"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
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
              placeholder="Ask about destinations, itineraries…"
              className="min-h-[38px] max-h-[80px] resize-none text-xs"
              rows={1}
            />
            <Button
              ref={sendBtnRef}
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 h-[38px] w-[38px] border-2 border-foreground"
              data-pendo-id="send-message"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
