import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/gratitude")({
  component: GratitudePage,
});

function todayISO() { return format(new Date(), "yyyy-MM-dd"); }

function GratitudePage() {
  const qc = useQueryClient();
  const today = todayISO();
  const [b1, setB1] = useState(""); const [b2, setB2] = useState(""); const [b3, setB3] = useState("");
  const [closer, setCloser] = useState(""); const [person, setPerson] = useState(""); const [lesson, setLesson] = useState("");

  const q = useSuspenseQuery({
    queryKey: ["gratitude"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gratitude_entries").select("*").order("date", { ascending: false }).limit(14);
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      const blessings = [b1, b2, b3].filter(Boolean);
      const existing = q.data.find((e) => e.date === today);
      if (existing) {
        await supabase.from("gratitude_entries").update({ blessings, closer_moment: closer, grateful_for: person, lesson }).eq("id", existing.id);
      } else {
        await supabase.from("gratitude_entries").insert({ user_id, date: today, blessings, closer_moment: closer, grateful_for: person, lesson });
      }
    },
    onSuccess: () => { toast.success("Alhamdulillah — saved."); qc.invalidateQueries({ queryKey: ["gratitude"] }); },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl text-primary"><Heart className="h-6 w-6 text-gold" /> Gratitude</h1>
        <p className="text-sm text-muted-foreground">Shukr multiplies blessings. Even one line changes the heart.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="font-display">Today</CardTitle><CardDescription>{format(new Date(), "EEEE, d MMMM")}</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Three blessings today</Label>
            <Input value={b1} onChange={(e) => setB1(e.target.value)} placeholder="1. …" className="mt-1" />
            <Input value={b2} onChange={(e) => setB2(e.target.value)} placeholder="2. …" className="mt-2" />
            <Input value={b3} onChange={(e) => setB3(e.target.value)} placeholder="3. …" className="mt-2" />
          </div>
          <div><Label>A moment that brought me closer to Allah</Label>
            <Textarea rows={2} value={closer} onChange={(e) => setCloser(e.target.value)} className="mt-1" />
          </div>
          <div><Label>Someone I'm grateful for</Label>
            <Input value={person} onChange={(e) => setPerson(e.target.value)} className="mt-1" />
          </div>
          <div><Label>A lesson learned</Label>
            <Textarea rows={2} value={lesson} onChange={(e) => setLesson(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle className="font-display">Recent</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {q.data.length === 0 && <p className="text-sm text-muted-foreground">No entries yet.</p>}
          {q.data.map((e) => (
            <div key={e.id} className="rounded-md border p-3 text-sm">
              <p className="mb-1 font-medium">{format(new Date(e.date + "T00:00:00"), "EEE, d MMM")}</p>
              {e.blessings && e.blessings.length > 0 && (
                <ul className="ml-4 list-disc text-muted-foreground">
                  {e.blessings.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
              {e.closer_moment && <p className="mt-1"><b className="text-primary">Closer:</b> {e.closer_moment}</p>}
              {e.grateful_for && <p><b className="text-primary">Person:</b> {e.grateful_for}</p>}
              {e.lesson && <p><b className="text-primary">Lesson:</b> {e.lesson}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
