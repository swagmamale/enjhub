import { useMemo } from "react";
import { useAgents, useSettings } from "@/lib/store";
import bbdbuy from "@/assets/stickers/bbdbuy-logo-2.webp.asset.json";
import ootdbuy from "@/assets/stickers/0x0_4-2.png.asset.json";
import rizzitgo from "@/assets/stickers/logo-large-_Icw0HdY-2.png.asset.json";
import gtbuy from "@/assets/stickers/0x0_1-2.png.asset.json";
import usfans from "@/assets/stickers/unnamed_1-2.png.asset.json";
import cssbuy from "@/assets/stickers/images-2.png.asset.json";
import hipobuy from "@/assets/stickers/0x0-2.png.asset.json";
import litbuy from "@/assets/stickers/litbuy1-bdwW2qsLt48MVVL4-2.avif.asset.json";
import oopbuy from "@/assets/stickers/unnamed-2.png.asset.json";
import kakobuy from "@/assets/stickers/0x0-Xl4HETrWr55mfEC9-2.avif.asset.json";

/** Wgrane logotypy agentów — zawsze dostępne jako naklejki w tle. */
const AGENT_STICKERS = [
  bbdbuy.url,
  ootdbuy.url,
  rizzitgo.url,
  gtbuy.url,
  usfans.url,
  cssbuy.url,
  hipobuy.url,
  litbuy.url,
  oopbuy.url,
  kakobuy.url,
];

/** Deterministyczny pseudo-random (bez hydration mismatch). */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Tło z rozproszonych naklejek zbudowanych z grafik wgranych w panelu admina.
 * Brak powtórzeń sąsiadujących: lista jest unikalna i przetasowana deterministycznie.
 */
export function StickersBackground() {
  const { data: agents } = useAgents();
  const { data: settings } = useSettings();

  const stickers = useMemo(() => {
    const custom = (settings?.["bg_stickers"] ?? "").split("\n");
    const raw = [
      ...custom,
      ...AGENT_STICKERS,
      ...(agents ?? []).map((a) => a.avatar_url),
    ].filter((u): u is string => Boolean(u && u.trim()));

    const unique = Array.from(new Set(raw));
    // Deterministyczne tasowanie, aby układ był stabilny i różnorodny.
    return unique
      .map((url, i) => ({ url, k: rand(i + 1) }))
      .sort((a, b) => a.k - b.k)
      .map((s) => s.url)
      .slice(0, 22);
  }, [agents]);


  if (!stickers.length) return null;

  const cols = 4;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stickers.map((url, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const left = (col / cols) * 100 + rand(i * 3 + 1) * 14 + 2;
        const top = row * 18 + rand(i * 5 + 2) * 10;
        const rotate = rand(i * 7 + 3) > 0.45 ? Math.round((rand(i * 11 + 4) - 0.5) * 44) : 0;
        const size = 64 + Math.round(rand(i * 13 + 5) * 72);
        return (
          <img
            key={`${url}-${i}`}
            src={url}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              left: `${Math.min(left, 88)}%`,
              top: `${top}%`,
              width: size,
              height: size,
              transform: `rotate(${rotate}deg)`,
            }}
            className="absolute select-none rounded-2xl object-contain opacity-[0.06] blur-[0.3px]"
          />
        );
      })}
    </div>
  );
}
