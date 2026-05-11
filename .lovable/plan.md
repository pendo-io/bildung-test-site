## Objetivo

Hacer que el ciclo del bot deje de empezar **siempre** con el Concierge. En su lugar:

- **60% de los ciclos**: el Concierge se intercala en una posición random dentro del funnel de compra (puede caer antes del filtro, entre dos stages cualquiera, o después de Booking Completed).
- **40% de los ciclos**: el ciclo no usa el Concierge en absoluto — solo funnel + bot de otras áreas.

Además, agregar el track event nuevo **`Interacted with Concierge`** (#11) que se dispara en cada prompt del usuario.

---

## Cambios

### 1. `src/lib/pendoTrack.ts`
Sin cambios — ya existe `trackEvent()`.

### 2. `src/components/bill-guard/InlineChatPanel.tsx`

**a) Agregar el nuevo track event en `send()`** (después del `trackPendoAgent("prompt", …)` existente):

```ts
trackEvent("Interacted with Concierge", {
  conversationId: conversationIdRef.current,
  messageId: promptMessageId,
  promptLength: trimmed.length,
  suggestedPrompt: isSuggested,
  isRagePrompt: RAGE_PROMPTS.includes(trimmed),
  promptIndexInConversation: currentMessages.filter(m => m.role === "user").length + 1,
});
```

**b) Refactor de `startAutoDemo`** para randomizar la posición del Concierge:

- Extraer la lógica actual del bloque "Concierge prompts" en una función interna `runConciergeBlock()` que devuelva `{ rageCount, negativeReactions, promptCount, messagesUsed }`.
- Al inicio de cada ciclo, decidir:
  - `useConcierge = Math.random() < 0.6` (60%).
  - Si `useConcierge`: elegir una **posición random** dentro de la secuencia del funnel (0 = antes del filter, 1 = entre filter y card, …, 7 = después de booking). Total 8 posiciones posibles.
- Reemplazar la llamada actual `runSyntheticFunnel(...)` por una **versión secuenciada** donde el Concierge se ejecuta en la posición elegida.

### 3. `src/lib/syntheticFunnel.ts`

Refactor para permitir inyectar un "hook" en cualquier stage. Dos opciones (elijo la **B** por menor riesgo):

**Opción B (elegida)** — exportar las stages como un array de funciones y agregar un wrapper:

```ts
export async function runSyntheticFunnelWithInterleave(opts: {
  rageCount: number;
  negativeReactions: number;
  totalPrompts: number;
  shouldStop?: () => boolean;
  interleaveAt?: number;          // 0..7, posición donde correr el hook
  interleaveFn?: () => Promise<void>;  // ej. runConciergeBlock
}): Promise<void>
```

Internamente: itera 7 stages con su `probs[i]` y check de drop-off; antes de la stage `i === interleaveAt` ejecuta `interleaveFn()`. Si `interleaveAt === 7`, lo corre al final (después de Booking Completed, si el funnel llegó tan lejos).

La función original `runSyntheticFunnel` se mantiene como wrapper que llama a la nueva sin `interleaveAt/interleaveFn` (back-compat).

**Importante sobre el tier de experiencia:**
Si el Concierge corre **antes** del funnel (posición 0), su rage/negative counts deben afectar el `experience_tier`. Si corre **en medio o al final**, el tier ya está fijado al inicio y el Concierge solo emite eventos sin afectar CVR.
→ Decisión: calcular tier una sola vez al inicio del ciclo con los datos del Concierge **si corrió antes**, o con `0/0/0` si no corrió antes. Así el comportamiento actual (Concierge primero → tier según experiencia) se preserva cuando `interleaveAt === 0`.

### 4. Loop en `startAutoDemo`

Pseudocódigo del nuevo ciclo:

```ts
while (autoDemoRef.current) {
  const useConcierge = Math.random() < 0.6;
  const interleaveAt = useConcierge ? randInt(0, 7) : -1;

  let conciergeStats = { rageCount: 0, negativeReactions: 0, promptCount: 0 };

  const conciergeHook = async () => {
    conciergeStats = await runConciergeBlock(); // setea input, click, reacciones, etc.
  };

  // Si Concierge va primero, lo corremos y ya tenemos el tier
  if (interleaveAt === 0) {
    await conciergeHook();
  }

  // Pausa breve
  await sleep(1500);

  // Funnel con hook intercalado (si interleaveAt > 0 y < 7, se ejecuta en medio)
  await runSyntheticFunnelWithInterleave({
    rageCount: conciergeStats.rageCount,
    negativeReactions: conciergeStats.negativeReactions,
    totalPrompts: conciergeStats.promptCount,
    interleaveAt: interleaveAt > 0 && interleaveAt < 7 ? interleaveAt : undefined,
    interleaveFn: interleaveAt > 0 && interleaveAt < 7 ? conciergeHook : undefined,
    shouldStop: () => !autoDemoRef.current,
  });

  // Si Concierge va al final, lo corremos ahora
  if (interleaveAt === 7) {
    await conciergeHook();
  }

  // Rotación de visitante + bot en otras áreas (igual que hoy)
  visitorIndex = (visitorIndex + 1) % 50;
  setUserByIndex(visitorIndex);
  if (onRunBotSequence) await onRunBotSequence(() => !autoDemoRef.current);

  // Limpiar chat
  setMessages([]); conversationIdRef.current = generateId();
}
```

---

## Resultado esperado

- **60%** de los ciclos → 1 funnel con Concierge intercalado en una de 8 posiciones random.
- **40%** de los ciclos → funnel sin Concierge (visitante que solo navega/compra).
- El track event nuevo `Interacted with Concierge` se dispara una vez por prompt en los ciclos que sí usan Concierge.
- En Pendo los paths/funnels van a ser mucho más variados: algunos visitantes llegan a Booking sin chatear, otros chatean al final (post-compra), otros antes, etc.

## Archivos tocados

- `src/components/bill-guard/InlineChatPanel.tsx` (track event nuevo + refactor del loop de demo)
- `src/lib/syntheticFunnel.ts` (nueva `runSyntheticFunnelWithInterleave`, mantener back-compat)
