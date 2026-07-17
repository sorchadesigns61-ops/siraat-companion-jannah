import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADHKAR } from "@/data/adhkar";

export const Route = createFileRoute("/_authenticated/dhikr")({
  component: DhikrPage,
});

function DhikrPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">Adhkar & Duas</h1>
        <p className="text-sm text-muted-foreground">Authentic remembrance from Qur'an and Sunnah.</p>
      </header>

      <Tabs defaultValue={ADHKAR[0].id}>
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {ADHKAR.map((c) => (
            <TabsTrigger key={c.id} value={c.id} className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {c.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {ADHKAR.map((c) => (
          <TabsContent key={c.id} value={c.id} className="space-y-4">
            <p className="text-sm text-muted-foreground">{c.description}</p>
            {c.items.map((d, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  {d.count && <CardDescription>Recite {d.count} times</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p dir="rtl" className="font-display text-2xl leading-loose text-primary">{d.arabic}</p>
                  <p className="text-sm italic text-muted-foreground">{d.transliteration}</p>
                  <p className="text-sm">{d.translation}</p>
                  {d.reference && <p className="text-xs text-gold">— {d.reference}</p>}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
