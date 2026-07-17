// Server-only helper for calling Lovable AI Gateway via plain fetch (chat completions).
export interface ChatMessage { role: "system" | "user" | "assistant"; content: string }

export async function chatComplete(messages: ChatMessage[], opts?: { model?: string; maxTokens?: number }): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: opts?.model ?? "google/gemini-2.5-flash",
      messages,
      max_tokens: opts?.maxTokens ?? 500,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI Gateway ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
