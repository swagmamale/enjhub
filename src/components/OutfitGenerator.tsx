import { useMemo, useRef, useState } from "react";
import { PriceTags, QualityBadges } from "@/components/PriceTags";
import { cnyFromPln, money, usdFromPln, type Agent, type Product } from "@/lib/store";
import { useLang } from "@/lib/i18n";

type SlotKey = "shoes" | "bottoms" | "tops" | "acc";

/** Kurtki są opcjonalne — domyślnie losujemy tylko koszulki i bluzy. */
const JACKET_MATCH = ["kurtk", "jacket", "puff", "coat"];

const buildSlots = (withJackets: boolean): { key: SlotKey; label: string; match: string[] }[] => [
  { key: "shoes", label: "Buty", match: ["but", "shoe", "sneak"] },
  { key: "bottoms", label: "Spodnie", match: ["spodni", "bottom", "pant", "short", "jean"] },
  {
    key: "tops",
    label: withJackets ? "Koszulka / Bluza / Kurtka" : "Koszulka / Bluza",
    match: ["koszul", "bluz", "top", "hood", "tee", ...(withJackets ? JACKET_MATCH : [])],
  },
  { key: "acc", label: "Czapka / Akcesoria", match: ["czap", "akces", "head", "cap", "hat", "zegar", "accessor"] },
];

const SLOT_KEYS: SlotKey[] = ["shoes", "bottoms", "tops", "acc"];

function pickPool(
  products: Product[],
  slot: { key: SlotKey; match: string[] },
  withJackets: boolean,
) {
  return products.filter((p) => {
    const c = (p.category || "").toLowerCase();
    if (slot.key === "tops" && !withJackets && JACKET_MATCH.some((m) => c.includes(m))) return false;
    return slot.match.some((m) => c.includes(m));
  });
}

function randomOf<T>(list: T[], exclude?: T): T | null {
  if (!list.length) return null;
  const pool = list.length > 1 && exclude ? list.filter((i) => i !== exclude) : list;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

/** Animated outfit randomizer picking one item per clothing slot. */
export function OutfitGenerator({
  products,
  agents,
  onDetails,
}: {
  products: Product[];
  agents: Agent[];
  onDetails?: (p: Product) => void;
}) {
  const { t } = useLang();
  const [withJackets, setWithJackets] = useState(false);
  const slots = useMemo(() => buildSlots(withJackets), [withJackets]);
  const pools = useMemo(
    () => slots.map((slot) => ({ slot, items: pickPool(products, slot, withJackets) })),
    [products, slots, withJackets],
  );
  const [outfit, setOutfit] = useState<Partial<Record<SlotKey, Product | null>>>({});
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = SLOT_KEYS.reduce((sum, k) => sum + Number(outfit[k]?.price ?? 0), 0);
  const hasResult = SLOT_KEYS.some((k) => outfit[k]);

  const rollAll = () => {
    if (spinning) return;
    setSpinning(true);
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks += 1;
      const next: Partial<Record<SlotKey, Product | null>> = {};
      for (const { slot, items } of pools) next[slot.key] = randomOf(items);
      setOutfit(next);
      if (ticks >= 14) {
        if (timer.current) clearInterval(timer.current);
        setSpinning(false);
      }
    }, 110);
  };

  const rollOne = (key: SlotKey) => {
    const entry = pools.find((p) => p.slot.key === key);
    if (!entry) return;
    setOutfit((o) => ({ ...o, [key]: randomOf(entry.items, o[key] ?? undefined) }));
  };

  return (
    <section className="mb-8 rounded-3xl border border-primary/40 bg-surface p-6 glow-ring">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            {t("outfit.kicker")}
          </p>
          <h2 className="mt-1 text-2xl font-black">
            {t("outfit.title1")}{" "}
            <span className="text-gradient-brand">{t("outfit.title2")}</span>
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("outfit.desc")}
          </p>
        </div>
        <button
          onClick={rollAll}
          disabled={spinning}
          className="rounded-xl gradient-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-surface-deep disabled:opacity-60"
        >
          {spinning ? t("outfit.rolling") : hasResult ? t("outfit.rollAgain") : t("outfit.roll")}
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SLOTS.map((slot) => {
          const item = outfit[slot.key] ?? null;
          const empty = pools.find((p) => p.slot.key === slot.key)?.items.length === 0;
          return (
            <div
              key={slot.key}
              className={`overflow-hidden rounded-2xl border bg-secondary/40 transition-all ${spinning ? "border-primary/60 opacity-80" : "border-border"}`}
            >
              <div className="border-b border-border px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {t(`outfit.${slot.key}`, slot.label)}
              </div>
              <div className="aspect-square overflow-hidden bg-secondary">
                {item?.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className={`h-full w-full object-cover ${spinning ? "blur-[1px]" : ""}`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-muted-foreground">
                    {empty ? t("outfit.empty") : t("outfit.clickRoll")}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 text-xs font-semibold">{item?.title ?? "—"}</p>
                {item ? (
                  <>
                    <PriceTags pln={Number(item.price)} size="sm" />
                    <QualityBadges quality={item.quality} batch={item.batch} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDetails?.(item)}
                        className="flex-1 rounded-lg border border-border px-2 py-1.5 text-[11px] font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        {t("outfit.preview")}
                      </button>
                      <button
                        onClick={() => rollOne(slot.key)}
                        className="rounded-lg border border-primary/60 px-2 py-1.5 text-[11px] font-bold text-primary"
                      >
                        🎲
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {hasResult ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("outfit.total")}
            </p>
            <p className="font-display text-2xl font-black">{money(total)} PLN</p>
            <p className="text-xs text-muted-foreground">
              ≈ ${money(usdFromPln(total))} · ¥{money(cnyFromPln(total))}
            </p>
          </div>
          <div className="flex gap-2">
            {agents.slice(0, 1).map((a) => (
              <a
                key={a.id}
                href={a.referral_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg gradient-brand px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-surface-deep"
              >
                Kup przez {a.name}
              </a>
            ))}
            <button
              onClick={rollAll}
              className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary"
            >
              Przelosuj wszystko
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
