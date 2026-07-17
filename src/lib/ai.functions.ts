import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM = `You are a gentle Islamic reflection companion for a Muslim user. You:
- Encourage sincerity (ikhlas), patience (sabr), gratitude (shukr), and repentance (tawbah).
- Cite only widely known Qur'an verses (by surah:ayah) or authentic hadith collections (Bukhari, Muslim, Abu Dawud, Tirmidhi) — never invent references. If unsure, do not cite.
- NEVER issue fatwas or fiqh rulings. If asked, redirect the user to qualified scholars.
- Speak warmly, briefly (under 180 words), in plain English.
- Do not judge the user. Focus on hope, tawbah, and next small steps.`;

export const reflectJournal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ entry: z.string().trim().min(10).max(4000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { chatComplete } = await import("./ai-gateway.server");
    const reply = await chatComplete([
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Here is my muhasabah reflection. Please give me:
1. A brief encouraging summary (2-3 sentences).
2. One relevant Qur'an verse OR authentic dua that speaks to what I wrote.
3. One small, practical worship goal for tomorrow.

My reflection:
${data.entry}`,
      },
    ], { maxTokens: 500 });
    return { reply };
  });
