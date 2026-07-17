import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/salah")({
  component: SalahPage,
});

const FARD = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const SUNNAH = ["sunnah", "witr", "tahajjud", "duha"] as const;
type AnyPrayer = (typeof FARD)[number] | (typeof SUNNAH)[number];

function weekDates(offset = 0) {
  const arr: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i - offset);
    arr.push(format(d, "yyyy-MM-dd"));
  }
  return arr;
}

function SalahPage() {
  const qc = useQueryClient();
  const [offset] = useState(0);
  const dates = weekDates(offset);

  const q = useSuspenseQuery({
    queryKey: ["salah-range", dates[0], dates[dates.length - 1]],
    queryFn: async () => {
      const { data, error } = await supabase.from("salah_log").select("*")
        .gte("date", dates[0]).lte("date", dates[dates.length - 1]);
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ date, prayer, prayed }: { date: string; prayer: AnyPrayer; prayed: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user_id = userData.user!.id;
      const existing = q.data.find((r) => r.date === date && r.prayer === prayer);
      if (existing) await supabase.from("salah_log").update({ prayed }).eq("id", existing.id);
      else await supabase.from("salah_log").insert({ user_id, date, prayer, prayed });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["salah-range"] }),
  });

  function cell(date: string, prayer: AnyPrayer) {
    const row = q.data.find((r) => r.date === date && r.prayer === prayer);
    const on = !!row?.prayed;
    return (
      <button
        key={date + prayer}
        onClick={() => toggle.mutate({ date, prayer, prayed: !on })}
        className={`aspect-square rounded-md border transition ${
          on ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
        }`}
        aria-label={`${prayer} ${date}`}
      >
        {on ? <CheckCircle2 className="mx-auto h-4 w-4" /> : <Circle className="mx-auto h-4 w-4 text-muted-foreground/50" />}
      </button>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">Salah</h1>
        <p className="text-sm text-muted-foreground">Track your five daily prayers and voluntary Sunnah.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Last 7 days</CardTitle>
          <CardDescription>Rows are prayers, columns are days.</CardDescription>
        </CardHeader>
        <CardContent>
          <PrayerGrid dates={dates} prayers={FARD as unknown as AnyPrayer[]} cell={cell} />
          <h3 className="mt-8 mb-2 font-display text-lg">Voluntary</h3>
          <PrayerGrid dates={dates} prayers={SUNNAH as unknown as AnyPrayer[]} cell={cell} />
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button asChild variant="ghost"><a href="/dashboard">← Back to today</a></Button>
      </div>
    </div>
  );
}

function PrayerGrid({
  dates, prayers, cell,
}: { dates: string[]; prayers: string[]; cell: (d: string, p: never) => React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: `100px repeat(${dates.length}, minmax(36px, 1fr))` }}>
        <div />
        {dates.map((d) => (
          <div key={d} className="pb-2 text-center text-[10px] uppercase text-muted-foreground">
            {format(new Date(d + "T00:00:00"), "EEE")}
          </div>
        ))}
        {prayers.map((p) => (
          <div key={p} className="contents">
            <div className="flex items-center pr-2 text-sm capitalize text-muted-foreground">{p}</div>
            {dates.map((d) => cell(d, p as never))}
          </div>
        ))}
      </div>
    </div>
  );
}
