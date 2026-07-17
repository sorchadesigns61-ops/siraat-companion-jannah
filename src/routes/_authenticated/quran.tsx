import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/quran")({
  component: QuranPage,
});

function QuranPage() {
  const qc = useQueryClient();
  const [surah, setSurah] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [reflection, setReflection] = useState(""); const [fav, setFav] = useState(false);

  const q = useSuspenseQuery({
    queryKey: ["quran"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quran_log").select("*").order("date", { ascending: false }).limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      await supabase.from("quran_log").insert({
        user_id, date: format(new Date(), "yyyy-MM-dd"),
        surah, ayah_from: from ? parseInt(from) : null, ayah_to: to ? parseInt(to) : null,
        reflection: reflection || null, favourite: fav,
      });
    },
    onSuccess: () => {
      toast.success("Barakallahu feek — logged.");
      qc.invalidateQueries({ queryKey: ["quran"] });
      setSurah(""); setFrom(""); setTo(""); setReflection(""); setFav(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const toggleFav = useMutation({
    mutationFn: async (row: { id: string; favourite: boolean }) => {
      await supabase.from("quran_log").update({ favourite: !row.favourite }).eq("id", row.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quran"] }),
  });

  const daysThisWeek = new Set(
    q.data.filter((r) => {
      const d = new Date(r.date + "T00:00:00");
      const days = (Date.now() - d.getTime()) / 86400000;
      return days < 7;
    }).map((r) => r.date),
  ).size;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl text-primary"><BookOpen className="h-6 w-6" /> Qur'an Companion</h1>
        <p className="text-sm text-muted-foreground">{daysThisWeek} day{daysThisWeek === 1 ? "" : "s"} read this week. "The best of you are those who learn the Qur'an and teach it."</p>
      </header>

      <Card className="mb-6">
        <CardHeader><CardTitle className="font-display">Log today's reading</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Surah</Label><Input value={surah} onChange={(e) => setSurah(e.target.value)} placeholder="e.g. Al-Baqarah" className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>From ayah</Label><Input type="number" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1" /></div>
            <div><Label>To ayah</Label><Input type="number" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label>Reflection (optional)</Label><Textarea rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} className="mt-1" placeholder="What spoke to your heart?" /></div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={fav} onCheckedChange={(v) => setFav(!!v)} /> Mark as favourite
          </label>
          <Button onClick={() => add.mutate()} disabled={add.isPending || !surah}>{add.isPending ? "Saving…" : "Add reading"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display">Recent</CardTitle><CardDescription>Your reading history and favourites.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {q.data.length === 0 && <p className="text-sm text-muted-foreground">No readings yet.</p>}
          {q.data.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-2 rounded-md border p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {r.surah}
                  {r.ayah_from ? ` : ${r.ayah_from}${r.ayah_to ? `-${r.ayah_to}` : ""}` : ""}
                  <span className="ml-2 text-xs text-muted-foreground">{format(new Date(r.date + "T00:00:00"), "d MMM")}</span>
                </p>
                {r.reflection && <p className="mt-1 text-muted-foreground">{r.reflection}</p>}
              </div>
              <button onClick={() => toggleFav.mutate({ id: r.id, favourite: !!r.favourite })} aria-label="favourite">
                <Star className={`h-4 w-4 ${r.favourite ? "fill-current text-gold" : "text-muted-foreground"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
