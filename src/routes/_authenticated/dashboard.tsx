import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Flame, Moon, Sparkles } from "lucide-react";
import { reminderForDate } from "@/data/reminders";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
type Prayer = (typeof PRAYERS)[number];

function todayISO() { return format(new Date(), "yyyy-MM-dd"); }

function Dashboard() {
  const qc = useQueryClient();
  const today = todayISO();

  const salahQ = useSuspenseQuery({
    queryKey: ["salah", today],
    queryFn: async () => {
      const { data, error } = await supabase.from("salah_log").select("*").eq("date", today);
      if (error) throw error;
      return data ?? [];
    },
  });

  const weekQ = useSuspenseQuery({
    queryKey: ["salah-week"],
    queryFn: async () => {
      const start = new Date(); start.setDate(start.getDate() - 6);
      const { data, error } = await supabase.from("salah_log").select("date,prayer,prayed")
        .gte("date", format(start, "yyyy-MM-dd"))
        .in("prayer", PRAYERS as unknown as string[]);
      if (error) throw error;
      return data ?? [];
    },
  });

  const journalQ = useSuspenseQuery({
    queryKey: ["journal-today"],
    queryFn: async () => {
      const { data } = await supabase.from("journal_entries").select("id").eq("date", today).maybeSingle();
      return !!data;
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ prayer, prayed }: { prayer: Prayer; prayed: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      const existing = salahQ.data.find((r) => r.prayer === prayer);
      if (existing) {
        await supabase.from("salah_log").update({ prayed }).eq("id", existing.id);
      } else {
        await supabase.from("salah_log").insert({ user_id, date: today, prayer, prayed });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["salah"] }),
  });

  const donePrayers = salahQ.data.filter((r) => PRAYERS.includes(r.prayer as Prayer) && r.prayed).length;
  const reminder = reminderForDate();

  // Streak = consecutive days with all 5 prayers logged as prayed
  const byDate = new Map<string, Set<string>>();
  for (const r of weekQ.data) {
    if (!r.prayed) continue;
    if (!byDate.has(r.date)) byDate.set(r.date, new Set());
    byDate.get(r.date)!.add(r.prayer);
  }
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = format(d, "yyyy-MM-dd");
    const set = byDate.get(key);
    if (set && PRAYERS.every((p) => set.has(p))) streak++;
    else if (i === 0) continue; // today doesn't break streak yet
    else break;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero card */}
      <Card className="mb-6 overflow-hidden border-primary/10 bg-hero text-primary-foreground shadow-soft">
        <div className="geometric-pattern p-6 sm:p-8">
          <p className="text-xs uppercase tracking-widest opacity-80">{format(new Date(), "EEEE, d MMMM")}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Assalamu 'alaykum</h1>
          <p className="mt-3 max-w-xl text-sm opacity-90">
            "{reminder.text}"
          </p>
          <p className="mt-1 text-xs text-gold">— {reminder.source}</p>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Iman streak</CardDescription>
            <CardTitle className="flex items-center gap-2 font-display text-3xl">
              <Flame className="h-6 w-6 text-gold" /> {streak} {streak === 1 ? "day" : "days"}
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">Consecutive days all five prayers logged.</p></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today's prayers</CardDescription>
            <CardTitle className="font-display text-3xl">{donePrayers} / 5</CardTitle>
          </CardHeader>
          <CardContent><Progress value={(donePrayers / 5) * 100} /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Muhasabah today</CardDescription>
            <CardTitle className="font-display text-3xl">{journalQ.data ? "Written" : "Not yet"}</CardTitle>
          </CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">Reflect before sleep — even one line counts.</p></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display"><Moon className="h-5 w-5 text-primary" /> Salah</CardTitle>
          <CardDescription>Tap to mark. No judgement — begin again whenever you can.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {PRAYERS.map((p) => {
              const row = salahQ.data.find((r) => r.prayer === p);
              const on = row?.prayed;
              return (
                <button
                  key={p}
                  onClick={() => toggle.mutate({ prayer: p, prayed: !on })}
                  className={`group flex flex-col items-center gap-1 rounded-lg border p-3 transition ${
                    on ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                  }`}
                >
                  {on ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                  <span className="text-xs font-medium capitalize">{p}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display"><Sparkles className="h-5 w-5 text-gold" /> Next steps</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button asChild variant="outline"><a href="/journal">Write muhasabah</a></Button>
          <Button asChild variant="outline"><a href="/quran">Log Qur'an reading</a></Button>
          <Button asChild variant="outline"><a href="/dhikr">Read adhkar</a></Button>
        </CardContent>
      </Card>
    </div>
  );
}
