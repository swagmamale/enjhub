import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PriceTags, QualityBadges } from "@/components/PriceTags";
import type { Product } from "@/lib/store";

/**
 * Lightweight grid card: single image + engagement, title, category, badges,
 * price and a "Sprawdź" CTA. Colorways / sizes / agent links live in the modal.
 */
export function ProductCard({
  product,
  onDetails,
}: {
  product: Product;
  onDetails?: (p: Product) => void;
}) {
  const [likes, setLikes] = useState(product.likes);
  const [dislikes, setDislikes] = useState(product.dislikes);
  const [wish, setWish] = useState(false);

  const vote = async (kind: "likes" | "dislikes") => {
    const next = kind === "likes" ? likes + 1 : dislikes + 1;
    if (kind === "likes") setLikes(next);
    else setDislikes(next);
    await supabase
      .from("products")
      .update(kind === "likes" ? { likes: next } : { dislikes: next })
      .eq("id", product.id);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-1 hover:border-primary/60 hover:glow-ring">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onClick={() => onDetails?.(product)}
            className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Brak zdjęcia
          </div>
        )}

        <button
          aria-label="Dodaj do ulubionych"
          onClick={() => setWish((w) => !w)}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-deep/70 backdrop-blur transition-all hover:border-primary hover:glow-ring"
        >
          <span className={wish ? "text-primary" : "text-muted-foreground"}>♥</span>
        </button>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <button
            aria-label="Lubię to"
            onClick={() => void vote("likes")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-deep/70 text-sm backdrop-blur transition-all hover:border-primary hover:glow-ring"
          >
            👍
          </button>
          <button
            aria-label="Nie lubię"
            onClick={() => void vote("dislikes")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-deep/70 text-sm backdrop-blur transition-all hover:border-primary hover:glow-ring"
          >
            👎
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-surface-deep/80 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
          <span>👍 {likes}</span>
          <span>👎 {dislikes}</span>
          <span>👁 {product.views}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
            {product.category || "Inne"}
          </span>
        </div>
        <QualityBadges quality={product.quality} batch={product.batch} />

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
          <PriceTags pln={Number(product.price)} />
          <button
            onClick={() => onDetails?.(product)}
            className="rounded-lg gradient-brand px-3 py-1.5 text-xs font-bold text-surface-deep transition-all hover:-translate-y-0.5 hover:glow-ring-strong hover:brightness-110"
          >
            Sprawdź →
          </button>
        </div>
      </div>
    </article>
  );
}
