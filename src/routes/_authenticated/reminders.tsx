import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import {
  DEFAULT_REMINDERS,
  loadReminders,
  requestNotificationPermission,
  saveReminders,
  type ReminderSettings,
} from "@/lib/reminders";

export const Route = createFileRoute("/_authenticated/reminders")({
  component: RemindersPage,
});

const FIELDS: Array<{ key: keyof Omit<ReminderSettings, "enabled">; label: string; group: "salah" | "adhkar" }> = [
  { key: "fajr", label: "Fajr", group: "salah" },
  { key: "dhuhr", label: "Dhuhr", group: "salah" },
  { key: "asr", label: "Asr", group: "salah" },
  { key: "maghrib", label: "Maghrib", group: "salah" },
  { key: "isha", label: "Isha", group: "salah" },
  { key: "morningAdhkar", label: "Morning Adhkar", group: "adhkar" },
  { key: "eveningAdhkar", label: "Evening Adhkar", group: "adhkar" },
];

function RemindersPage() {
  const [s, setS] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    setS(loadReminders());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPerm(Notification.permission);
    } else {
      setPerm("unsupported");
    }
  }, []);

  function update<K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) {
    const next = { ...s, [k]: v };
    setS(next);
    saveReminders(next);
  }

  async function enable() {
    const result = await requestNotificationPermission();
    setPerm(result);
    if (result === "granted") {
      update("enabled", true);
      toast.success("Reminders enabled.");
    } else if (result === "denied") {
      toast.error("Notifications are blocked in your browser settings.");
    }
  }

  function disable() {
    update("enabled", false);
    toast("Reminders paused.");
  }

  const salah = FIELDS.filter((f) => f.group === "salah");
  const adhkar = FIELDS.filter((f) => f.group === "adhkar");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl text-primary">
          <Bell className="h-6 w-6" /> Reminders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gentle nudges for your salah and adhkar. Reminders fire while Siraat is open in your browser or installed as an app.
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-display">
            <span>Notifications</span>
            <Switch
              checked={s.enabled && perm === "granted"}
              onCheckedChange={(v) => (v ? enable() : disable())}
              disabled={perm === "unsupported"}
            />
          </CardTitle>
          <CardDescription>
            {perm === "unsupported"
              ? "This browser does not support notifications."
              : perm === "denied"
              ? "Notifications are blocked. Enable them in your browser site settings, then return here."
              : s.enabled && perm === "granted"
              ? "Active. Keep Siraat open (or installed) so reminders can play."
              : "Turn on to allow gentle in-app reminders."}
          </CardDescription>
        </CardHeader>
        {perm !== "granted" && perm !== "unsupported" && (
          <CardContent>
            <Button onClick={enable} className="gap-2">
              <Bell className="h-4 w-4" /> Allow notifications
            </Button>
          </CardContent>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Moon className="h-5 w-5 text-primary" /> Salah times
          </CardTitle>
          <CardDescription>Approximate local times — adjust to your area's prayer schedule.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {salah.map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type="time"
                value={s[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Sun className="h-5 w-5 text-gold" /> Adhkar
          </CardTitle>
          <CardDescription>Bookend your day with remembrance.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {adhkar.map((f) => (
            <div key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type="time"
                value={s[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className="mt-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {!s.enabled && (
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <BellOff className="h-3 w-3" /> Reminders are currently paused.
        </p>
      )}
    </div>
  );
}
