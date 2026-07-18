import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Sparkles, Pause, Play, Square, BookOpen, Smartphone, Heart } from "lucide-react";
import { format, subDays } from "date-fns";

export const Route = createFileRoute("/_authenticated/focus")({
  component: FocusPage,
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-6">Not found</div>,
});

type Category = "beneficial" | "distraction";

const BENEFICIAL_PRESETS = ["Qur'an", "Study", "Dhikr", "Deep work", "Family", "Exercise"];
const DISTRACTION_PRESETS = ["Social media", "Short videos", "Aimless browsing", "Streaming", "News scrolling"];

function todayISO() { return format(new Date(), "yyyy-MM-dd"); }

function FocusPage() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<Category>("beneficial");
  const [activity, setActivity] = useState("Qur'an");
  const [intention, setIntention] = useState("");
  const [note, setNote] = useState("");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const startedAtRef = useRef<Date | null>(null);
  const timerRef = useRef<number | null>(null);

  const since = format(subDays(new Date(), 6), "yyyy-MM-dd");

  const weekQ = useSuspenseQuery({
    queryKey: ["focus-week"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .gte("date", since)
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [running]);

  const save = useMutation({
    mutationFn: async (payload: { minutes: number; started_at: string; ended_at: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      const { error } = await supabase.from("focus_sessions").insert({
        user_id,
        category,
        activity: activity.trim() || (category === "beneficial" ? "Beneficial time" : "Distraction"),
        intention: intention.trim() || null,
        note: note.trim() || null,
        minutes: payload.minutes,
        started_at: payload.started_at,
        ended_at: payload.ended_at,
        date: todayISO(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["focus-week"] });
      setSeconds(0); setNote(""); setIntention(""); startedAtRef.current = null;
    },
  });

  function start() {
    startedAtRef.current = new Date();
    setSeconds(0);
    setRunning(true);
  }
  function pause() { setRunning(false); }
  function resume() { setRunning(true); }
  function stopAndSave() {
    setRunning(false);
    const started = startedAtRef.current ?? new Date(Date.now() - seconds * 1000);
    const ended = new Date();
    const minutes = Math.max(1, Math.round(seconds / 60));
    save.mutate({ minutes, started_at: started.toISOString(), ended_at: ended.toISOString() });
  }
  function logManual(minutes: number) {
    const ended = new Date();
    const started = new Date(ended.getTime() - minutes * 60_000);
    save.mutate({ minutes, started_at: started.toISOString(), ended_at: ended.toISOString() });
  }

  const today = todayISO();
  const todays = weekQ.data.filter((r) => r.date === today);
  const beneficialMin = todays.filter((r) => r.category === "beneficial").reduce((a, r) => a + r.minutes, 0);
  const distractionMin = todays.filter((r) => r.category === "distraction").reduce((a, r) => a + r.minutes, 0);
  const total = beneficialMin + distractionMin;
  const beneficialPct = total ? (beneficialMin / total) * 100 : 0;

  const presets = category === "beneficial" ? BENEFICIAL_PRESETS : DISTRACTION_PRESETS;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl text-primary">
          <Target className="h-6 w-6" /> Focus
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track time given to what draws you closer, and gently notice where attention slips — no shame, just awareness.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today · beneficial</CardDescription>
            <CardTitle className="flex items-center gap-2 font-display text-3xl text-primary">
              <Heart className="h-5 w-5 text-gold" /> {beneficialMin}m
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today · distractions</CardDescription>
            <CardTitle className="flex items-center gap-2 font-display text-3xl">
              <Smartphone className="h-5 w-5 text-muted-foreground" /> {distractionMin}m
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Beneficial share</CardDescription>
            <CardTitle className="font-display text-3xl">{Math.round(beneficialPct)}%</CardTitle>
          </CardHeader>
          <CardContent><Progress value={beneficialPct} /></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Sparkles className="h-5 w-5 text-gold" /> New session
          </CardTitle>
          <CardDescription>Set a niyyah, start the timer, or log time you already spent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={category === "beneficial" ? "default" : "outline"}
              onClick={() => { setCategory("beneficial"); setActivity(BENEFICIAL_PRESETS[0]); }}
              className="flex-1"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Beneficial
            </Button>
            <Button
              type="button"
              variant={category === "distraction" ? "default" : "outline"}
              onClick={() => { setCategory("distraction"); setActivity(DISTRACTION_PRESETS[0]); }}
              className="flex-1"
            >
              <Smartphone className="mr-2 h-4 w-4" /> Distraction
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setActivity(p)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  activity === p ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="activity">Activity</Label>
              <Input id="activity" value={activity} onChange={(e) => setActivity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="intention">
                {category === "beneficial" ? "Niyyah (intention)" : "What pulled you in?"}
              </Label>
              <Input
                id="intention"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder={category === "beneficial" ? "For the sake of Allah…" : "Boredom, habit, tired…"}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="rounded-lg border bg-card/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Timer</p>
                <p className="font-display text-4xl tabular-nums">
                  {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
                </p>
              </div>
              <div className="flex gap-2">
                {!running && seconds === 0 && (
                  <Button onClick={start}><Play className="mr-2 h-4 w-4" /> Start</Button>
                )}
                {running && (
                  <Button onClick={pause} variant="outline"><Pause className="mr-2 h-4 w-4" /> Pause</Button>
                )}
                {!running && seconds > 0 && (
                  <>
                    <Button onClick={resume} variant="outline"><Play className="mr-2 h-4 w-4" /> Resume</Button>
                    <Button onClick={stopAndSave} disabled={save.isPending}>
                      <Square className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">Or log time already spent:</p>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 30, 45, 60].map((m) => (
                <Button key={m} variant="outline" size="sm" disabled={save.isPending} onClick={() => logManual(m)}>
                  +{m}m
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display">Last 7 days</CardTitle>
          <CardDescription>A gentle mirror — not a scoreboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {weekQ.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet. Begin with even five minutes.</p>
          ) : (
            <ul className="divide-y">
              {weekQ.data.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          r.category === "beneficial" ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      />
                      {r.activity}
                      <span className="text-xs font-normal text-muted-foreground">
                        · {format(new Date(r.started_at), "EEE HH:mm")}
                      </span>
                    </p>
                    {r.intention && <p className="mt-0.5 truncate text-xs text-muted-foreground">"{r.intention}"</p>}
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{r.minutes}m</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
