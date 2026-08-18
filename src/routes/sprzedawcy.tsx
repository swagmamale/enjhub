import { createFileRoute, Link } from "@tanstack/react-router";
import { useProducts, useSellers } from "@/lib/store";

export const Route = createFileRoute("/sprzedawcy")({
  head: () => ({
    meta: [
      { title: "Sprzedawcy i sklepy — PKMREPS" },
      {
        name: "description",
        content: "Sklepy prowadzone przez zweryfikowanych sprzedawców na platformie PKMREPS.",
      },
      { property: "og:title", content: "Sprzedawcy i sklepy — PKMREPS" },
      {
        property: "og:description",
        content: "Przeglądaj sklepy sprzedawców i ich produkty w jednym miejscu.",
      },
    ],
  }),
  component: SprzedawcyPage,
});

function SprzedawcyPage() {
  const { data: sellers } = useSellers();
  const { data: products } = useProducts();
  const active = (sellers ?? []).filter((s) => s.active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">
        Sklepy <span className="text-gradient-brand">sprzedawców</span>
      </h1>



      {active.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted-foreground">
          Brak aktywnych sklepów.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((s) => {
            const count = (products ?? []).filter((p) => p.seller_id === s.id).length;
            return (
              <article
                key={s.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-primary/60 hover:glow-ring"
              >
                {s.banner_url ? (
                  <img src={s.banner_url} alt="" className="h-28 w-full object-cover" />
                ) : (
                  <div className="h-28 w-full gradient-brand opacity-40" />
                )}
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    {s.logo_url ? (
                      <img
                        src={s.logo_url}
                        alt={s.name}
                        className="h-11 w-11 rounded-xl object-cover glow-ring"
                      />
                    ) : null}
                    <div>
                      <h2 className="text-base font-bold">{s.name}</h2>
                      <p className="text-[11px] text-muted-foreground">/{s.slug}</p>
                    </div>
                  </div>
                  {s.description ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  ) : null}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">{count} produktów</span>
                    <Link
                      to="/sklep/$slug"
                      params={{ slug: s.slug }}
                      className="rounded-lg gradient-brand px-3 py-1.5 text-xs font-bold text-surface-deep"
                    >
                      Wejdź →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
