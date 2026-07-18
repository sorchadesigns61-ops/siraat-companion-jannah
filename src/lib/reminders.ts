import { useEffect } from "react";

export type ReminderSettings = {
  enabled: boolean;
  morningAdhkar: string; // "HH:mm"
  eveningAdhkar: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
};

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  morningAdhkar: "06:30",
  eveningAdhkar: "17:30",
  fajr: "05:15",
  dhuhr: "13:00",
  asr: "16:30",
  maghrib: "18:45",
  isha: "20:15",
};

const STORAGE_KEY = "siraat.reminders.v1";
const FIRED_KEY = "siraat.reminders.fired.v1"; // { [YYYY-MM-DD:key]: true }

export function loadReminders(): ReminderSettings {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REMINDERS;
    return { ...DEFAULT_REMINDERS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(s: ReminderSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("siraat:reminders-updated"));
}

type Slot = { key: string; label: string; body: string; time: string };

function slotsFrom(s: ReminderSettings): Slot[] {
  return [
    { key: "fajr", label: "Fajr", body: "Time for Fajr — begin the day with Allah.", time: s.fajr },
    { key: "morningAdhkar", label: "Morning Adhkar", body: "Fortify your morning with remembrance.", time: s.morningAdhkar },
    { key: "dhuhr", label: "Dhuhr", body: "Pause for Dhuhr.", time: s.dhuhr },
    { key: "asr", label: "Asr", body: "Time for Asr — do not let it slip.", time: s.asr },
    { key: "eveningAdhkar", label: "Evening Adhkar", body: "Seal your evening with dhikr.", time: s.eveningAdhkar },
    { key: "maghrib", label: "Maghrib", body: "Time for Maghrib.", time: s.maghrib },
    { key: "isha", label: "Isha", body: "Time for Isha — end the day upon iman.", time: s.isha },
  ];
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadFired(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}"); } catch { return {}; }
}
function saveFired(f: Record<string, boolean>) {
  // Keep only today's keys to avoid growth
  const today = todayKey();
  const trimmed: Record<string, boolean> = {};
  for (const k of Object.keys(f)) if (k.startsWith(today)) trimmed[k] = f[k];
  localStorage.setItem(FIRED_KEY, JSON.stringify(trimmed));
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  return await Notification.requestPermission();
}

function fire(slot: Slot) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(`Siraat · ${slot.label}`, {
        body: slot.body,
        icon: "/favicon.ico",
        tag: `siraat-${slot.key}`,
      });
    }
  } catch {
    // Safari may throw on direct Notification() — silent fallback
  }
}

/**
 * Mount once inside the authenticated layout. While the app tab is open,
 * checks every minute whether any reminder time has been reached and fires
 * a browser notification (once per day per slot).
 *
 * Note: This is best-effort in-app scheduling. Reminders only fire while
 * the app is open somewhere in the browser — a true installable PWA scope.
 */
export function useReminderScheduler() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let settings = loadReminders();

    function onUpdate() { settings = loadReminders(); }
    window.addEventListener("siraat:reminders-updated", onUpdate);

    function tick() {
      if (!settings.enabled) return;
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const fired = loadFired();
      const today = todayKey();

      for (const slot of slotsFrom(settings)) {
        if (slot.time !== hhmm) continue;
        const firedKey = `${today}:${slot.key}`;
        if (fired[firedKey]) continue;
        fire(slot);
        fired[firedKey] = true;
      }
      saveFired(fired);
    }

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("siraat:reminders-updated", onUpdate);
    };
  }, []);
}
