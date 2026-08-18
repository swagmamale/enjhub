import { useEffect, useState } from "react";
import { useSettings } from "@/lib/store";

export function PromoModal() {
  const { data: settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  if (!open || !settings) return null;
  const code = settings["promo_code"] || "PKMR";
  const banner = settings["promo_banner_url"] || settings["agent_logo_url"];
  const link = settings["primary_agent_url"] || "#";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-deep/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-surface p-6 text-center glow-ring">
        <button
          onClick={() => setOpen(false)}
          aria-label="Zamknij"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:glow-ring-strong"
        >
          ✕
        </button>

        {banner ? (
          <img
            src={banner}
            alt="Promocja agenta"
            className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover glow-ring"
          />
        ) : null}

        <h2 className="text-xl font-bold leading-snug">
          Zarejestruj się, aby uzyskać <span className="text-gradient-brand">$450</span> w kuponach
          oraz 40% zniżki
        </h2>
        <p className="mt-2 text-sm font-extrabold uppercase tracking-widest text-primary animate-pulse-glow">
          Limitowana oferta!
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="rounded-lg border border-dashed border-primary/60 bg-secondary px-4 py-2 font-mono text-lg font-bold tracking-[0.3em] text-primary">
            {code}
          </span>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            {copied ? "Skopiowano" : "Kopiuj"}
          </button>
        </div>

        <p className="mt-4 text-3xl font-black text-gradient-brand">$40 OFF!</p>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block rounded-xl gradient-brand px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-surface-deep transition-transform hover:scale-[1.02]"
        >
          Zarejestruj się teraz
        </a>
      </div>
    </div>
  );
}
