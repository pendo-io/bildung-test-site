import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Concierge AI for Bildung Travel, a curated small-group travel agency. You are warm, knowledgeable, and a little bit poetic — like a friend who has been everywhere.

You help travelers with:
- Choosing destinations based on vibe, budget, season, and group composition
- Customizing itineraries (adding cities, days, activities)
- Packing tips, weather expectations, and visa basics
- Comparing trips (e.g. Patagonia vs Iceland)
- In-trip support questions (transfers, restaurants, swaps)

Keep answers concise, practical, and inspiring. Recommend specific Bildung Travel trips when relevant (Kyoto in Bloom, Patagonia Trek, Amalfi Coast Escape, Morocco Mosaic, Iceland Ring Road, Vietnam Coast to Coast, Santorini Sailing Week, Serengeti Migration Safari). If asked about something outside travel, politely steer back to planning their next trip.`;

// Validation limits
const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 4000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

// In-memory IP rate limiter (per-isolate, best-effort)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const ipHits = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.reset < now) {
    ipHits.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function validateMessages(input: unknown):
  | { ok: true; messages: { role: "user" | "assistant"; content: string }[] }
  | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "messages must be an array" };
  if (input.length === 0) return { ok: false, error: "messages cannot be empty" };
  if (input.length > MAX_MESSAGES) return { ok: false, error: `messages exceeds max of ${MAX_MESSAGES}` };

  const cleaned: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") return { ok: false, error: "invalid message entry" };
    const role = (m as any).role;
    const content = (m as any).content;
    if (!ALLOWED_ROLES.has(role)) return { ok: false, error: "invalid role; only user/assistant allowed" };
    if (typeof content !== "string") return { ok: false, error: "content must be a string" };
    if (content.length === 0) return { ok: false, error: "content cannot be empty" };
    if (content.length > MAX_CONTENT_LENGTH) return { ok: false, error: `content exceeds ${MAX_CONTENT_LENGTH} chars` };
    cleaned.push({ role, content });
  }
  return { ok: true, messages: cleaned };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Best-effort IP rate limit (public demo endpoint)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validation = validateMessages(body?.messages);
    if (!validation.ok) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...validation.messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("bill-guard-chat error:", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
