import { cnyFromPln, money, usdFromPln } from "@/lib/store";

/** Main PLN price with automatic USD / CNY estimates underneath. */
export function PriceTags({ pln, size = "md" }: { pln: number; size?: "sm" | "md" | "lg" }) {
  const main =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <div>
      <p className={`font-display ${main} font-bold leading-tight`}>{money(pln)} PLN</p>
      <p className="text-[11px] text-muted-foreground">
        ≈ ${money(usdFromPln(pln))} · ¥{money(cnyFromPln(pln))}
      </p>
    </div>
  );
}

export function QualityBadges({ quality, batch }: { quality: string; batch?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="rounded-md border border-brand-teal/50 bg-brand-teal/15 px-2 py-0.5 text-[11px] font-semibold text-brand-cyan">
        Quality: {quality || "—"}
      </span>
      {batch ? (
        <span className="rounded-md border border-primary/50 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
          Batch: {batch}
        </span>
      ) : null}
    </div>
  );
}
