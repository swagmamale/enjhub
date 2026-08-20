import { useSocialLinks } from "@/lib/store";

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface text-primary transition-all hover:glow-ring-strong hover:border-primary"
    >
      {children}
    </a>
  );
}

/**
 * Prawa wyspa z linkami social. Zawiera WYŁĄCZNIE linki dodane ręcznie
 * w panelu (Branding → Socialne (dynamiczne)) — agenci nigdy nie trafiają tu automatycznie.
 */
export function FloatingIsland() {
  const { data: socials } = useSocialLinks();

  const links = (socials ?? []).filter((l) => l.url);
  if (!links.length) return null;

  return (
    <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl border border-border bg-surface-deep/80 p-2 backdrop-blur-xl glow-ring sm:flex">
      {links.map((l) => (
        <IconLink key={l.id} href={l.url} label={l.label}>
          {l.image_url ? (
            <img
              src={l.image_url}
              alt={l.label}
              loading="lazy"
              className="h-7 w-7 rounded-lg object-cover"
            />
          ) : (
            <span className="text-xs font-bold">
              {l.icon || l.label.slice(0, 2).toUpperCase()}
            </span>
          )}
        </IconLink>
      ))}
    </div>
  );
}
