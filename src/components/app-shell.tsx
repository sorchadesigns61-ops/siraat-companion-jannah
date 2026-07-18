import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, Heart, Home, LogOut, Menu, Moon, Sparkles, PenLine, Star, Target } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReminderScheduler } from "@/lib/reminders";

const NAV = [
  { to: "/dashboard", label: "Today", icon: Home },
  { to: "/salah", label: "Salah", icon: Moon },
  { to: "/quran", label: "Qur'an", icon: BookOpen },
  { to: "/focus", label: "Focus", icon: Target },
  { to: "/journal", label: "Muhasabah", icon: PenLine },
  { to: "/gratitude", label: "Gratitude", icon: Heart },
  { to: "/dhikr", label: "Adhkar", icon: Star },
] as const;

const SECONDARY_NAV = [
  { to: "/reminders", label: "Reminders", icon: Bell },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  useReminderScheduler();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <BrandHeader />
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} active={location.pathname === n.to} icon={n.icon}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Button onClick={signOut} variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg text-primary">
            <Sparkles className="h-4 w-4 text-gold" /> Siraat
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        {open && (
          <div className="border-b bg-sidebar px-3 py-2 lg:hidden">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} active={location.pathname === n.to} icon={n.icon} onClick={() => setOpen(false)}>
                {n.label}
              </NavLink>
            ))}
            <Button onClick={signOut} variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>

        {/* Mobile bottom tab bar */}
        <nav className="sticky bottom-0 z-30 grid grid-cols-7 border-t bg-background/95 backdrop-blur lg:hidden">
          {NAV.map((n) => {
            const Active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] transition",
                  Active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <n.icon className={cn("h-5 w-5", Active && "text-primary")} />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function BrandHeader() {
  return (
    <div className="border-b border-sidebar-border px-5 py-5">
      <Link to="/dashboard" className="flex items-center gap-2 font-display text-2xl text-sidebar-primary">
        <Sparkles className="h-5 w-5 text-gold" />
        Siraat
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">Your companion to Jannah</p>
    </div>
  );
}

function NavLink({
  to, active, icon: Icon, children, onClick,
}: {
  to: string; active: boolean; icon: React.ComponentType<{ className?: string }>;
  children: ReactNode; onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
          : "text-sidebar-foreground hover:bg-sidebar-accent",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
