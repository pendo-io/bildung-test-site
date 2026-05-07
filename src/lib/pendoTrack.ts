// Pendo track event helper
// Docs: https://support.pendo.io/hc/en-us/articles/360032294291-Configure-Track-Events
// Usage: trackEvent('Trip Card Clicked', { ...metadata })

export function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  const payload = {
    ...properties,
    timestamp: new Date().toISOString(),
  };
  try {
    if (typeof window !== "undefined" && (window as any).pendo?.track) {
      (window as any).pendo.track(event, payload);
    }
  } catch (err) {
    // swallow — analytics should never break the app
    console.warn("[pendo.track] failed", event, err);
  }
  // Helpful while developing / for QA
  if (typeof window !== "undefined") {
    console.debug("[pendo.track]", event, payload);
  }
}
