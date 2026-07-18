import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reflectJournal } from "@/lib/ai.functions";
import { Sparkles, BookOpenCheck } from "lucide-react";
import { comfortForMood } from "@/data/comfort-ayahs";

export const Route = createFileRoute("/_authenticated/journal")({
  component: JournalPage,
});

const MOODS = ["grateful", "hopeful", "sorrowful", "distracted", "peaceful", "anxious", "repentant"];

function todayISO() { return format(new Date(), "yyyy-MM-dd"); }

function JournalPage() {
  const qc = useQueryClient();
  const today = todayISO();
  const [form, setForm] = useState({
    mood: "", did_well: "", mistakes: "", blessings: "", lessons: "", duas: "", tomorrow: "",
  });
  const [ai, setAi] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const reflect = useServerFn(reflectJournal);

  const q = useSuspenseQuery({
    queryKey: ["journal-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_entries").select("*").order("date", { ascending: false }).limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });

  const todayEntry = q.data.find((e) => e.date === today);

  useEffect(() => {
    if (todayEntry) {
      setForm({
        mood: todayEntry.mood ?? "",
        did_well: todayEntry.did_well ?? "",
        mistakes: todayEntry.mistakes ?? "",
        blessings: todayEntry.blessings ?? "",
        lessons: todayEntry.lessons ?? "",
        duas: todayEntry.duas ?? "",
        tomorrow: todayEntry.tomorrow ?? "",
      });
    }
  }, [todayEntry?.id]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      if (todayEntry) {
        await supabase.from("journal_entries").update({ ...form }).eq("id", todayEntry.id);
      } else {
        await supabase.from("journal_entries").insert({ user_id, date: today, ...form });
      }
    },
    onSuccess: () => { toast.success("Saved."); qc.invalidateQueries({ queryKey: ["journal-list"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  async function askAi() {
    const entry = [form.did_well, form.mistakes, form.blessings, form.lessons, form.tomorrow].filter(Boolean).join("\n\n");
    if (entry.trim().length < 10) { toast.info("Write a little more first."); return; }
    setAiLoading(true); setAi(null);
    try {
      const { reply } = await reflect({ data: { entry } });
      setAi(reply);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI reflection failed");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">Muhasabah</h1>
        <p className="text-sm text-muted-foreground">A private moment of self-accountability. Only you can see this.</p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display">{format(new Date(), "EEEE, d MMMM yyyy")}</CardTitle>
          <CardDescription>Write freely. Every line is a step toward Him.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mood</Label>
            <Select value={form.mood} onValueChange={(v) => setForm({ ...form, mood: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="How is your heart today?" /></SelectTrigger>
              <SelectContent>{MOODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {(() => {
            const comfort = comfortForMood(form.mood);
            if (!comfort) return null;
            return (
              <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                  <BookOpenCheck className="h-3 w-3" /> A reminder for a {form.mood} heart
                </p>
                <p dir="rtl" className="font-display text-xl leading-loose text-primary">{comfort.arabic}</p>
                <p className="mt-2 text-sm">{comfort.translation}</p>
                <p className="mt-1 text-xs text-gold">— {comfort.reference}</p>
                {comfort.note && <p className="mt-2 text-xs italic text-muted-foreground">{comfort.note}</p>}
              </div>
            );
          })()}
          {([
            ["did_well", "What did I do well today?"],
            ["mistakes", "What do I want to improve?"],
            ["blessings", "Blessings from Allah I noticed"],
            ["lessons", "Lessons learned"],
            ["duas", "Personal duas"],
            ["tomorrow", "My intention for tomorrow"],
          ] as const).map(([k, label]) => (
            <div key={k}>
              <Label htmlFor={k}>{label}</Label>
              <Textarea id={k} rows={3} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1" />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : todayEntry ? "Update entry" : "Save entry"}
            </Button>
            <Button onClick={askAi} disabled={aiLoading} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              {aiLoading ? "Reflecting…" : "AI reflection"}
            </Button>
          </div>
          {ai && (
            <div className="rounded-lg border bg-secondary/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {ai}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display">Past entries</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {q.data.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          {q.data.map((e) => (
            <details key={e.id} className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium">
                {format(new Date(e.date + "T00:00:00"), "EEEE, d MMM yyyy")}
                {e.mood && <span className="ml-2 text-xs text-muted-foreground">· {e.mood}</span>}
              </summary>
              <div className="mt-2 space-y-2 text-sm text-foreground/80">
                {e.did_well && <p><b className="text-primary">Did well:</b> {e.did_well}</p>}
                {e.mistakes && <p><b className="text-primary">Improve:</b> {e.mistakes}</p>}
                {e.blessings && <p><b className="text-primary">Blessings:</b> {e.blessings}</p>}
                {e.lessons && <p><b className="text-primary">Lessons:</b> {e.lessons}</p>}
                {e.duas && <p><b className="text-primary">Duas:</b> {e.duas}</p>}
                {e.tomorrow && <p><b className="text-primary">Tomorrow:</b> {e.tomorrow}</p>}
              </div>
            </details>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
