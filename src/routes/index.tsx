import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Moon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 geometric-pattern opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="tracking-wide">بسم الله الرحمن الرحيم</span>
          </div>
          <h1 className="font-display text-5xl leading-tight sm:text-7xl">
            Siraat
            <span className="block text-gold">Your Companion to Jannah</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg opacity-90">
            A quiet, private companion to help you draw closer to Allah — through daily prayer,
            Qur'an, reflection, and remembrance. No comparison. No distraction. Just steady steps
            upon the straight path.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:opacity-90">
              <Link to="/auth">Begin your journey</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10">
              <Link to="/auth">I already have an account</Link>
            </Button>
          </div>
          <p className="mt-8 max-w-xl font-display text-lg italic opacity-80">
            "And whoever relies upon Allah — then He is sufficient for him." — Qur'an 65:3
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl text-foreground sm:text-4xl">
          A gentle framework for consistent worship
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card-gradient p-6 shadow-soft transition hover:-translate-y-0.5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Built as an amana — for your niyyah, not for comparison.
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: Moon, title: "Salah Tracker", desc: "Mark the five daily prayers and Sunnah with a soft weekly rhythm." },
  { icon: BookOpen, title: "Qur'an Companion", desc: "Log reading, memorization, and reflections on ayaat you love." },
  { icon: Heart, title: "Muhasabah Journal", desc: "A private space to reflect, repent, and reset — encrypted to you." },
  { icon: Sparkles, title: "Authentic Adhkar", desc: "Morning, evening, sleep, and travel duas with references." },
  { icon: Heart, title: "Gratitude", desc: "Three blessings a day — a Sunnah of shukr." },
  { icon: Sparkles, title: "AI Reflection", desc: "Gentle summaries and verse suggestions — never fatwas." },
];
