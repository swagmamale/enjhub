import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { safeStorage, useSettings } from "@/lib/store";

export type Lang = "pl" | "en";

/** Domyślne teksty. Admin może nadpisać każdy z nich w zakładce „Języki”. */
export const DICT: Record<string, { pl: string; en: string }> = {
  "nav.finder": { pl: "Product Finder", en: "Product Finder" },
  "nav.outfits": { pl: "Losowanie outfitów", en: "Outfit roll" },
  "nav.sellers": { pl: "Sprzedawcy", en: "Stores" },
  "nav.agents": { pl: "Agenci", en: "Agents" },
  "nav.promos": { pl: "Promocje", en: "Deals" },
  "nav.guide": { pl: "Poradnik & Narzędzia", en: "Guides & Tools" },
  "nav.tiktok": { pl: "Linki z TikToka", en: "TikTok Links" },
  "finder.all": { pl: "Wszystkie produkty", en: "All products" },
  "finder.search": { pl: "Szukaj produktu...", en: "Search products..." },
  "finder.priceFrom": { pl: "Cena od (PLN)", en: "Price from (PLN)" },
  "finder.priceTo": { pl: "Cena do (PLN)", en: "Price to (PLN)" },
  "finder.clear": { pl: "Wyczyść filtry", en: "Clear filters" },
  "finder.empty": { pl: "Brak produktów do wyświetlenia.", en: "No products to display." },
  "finder.allCats": { pl: "Wszystkie", en: "All" },
  "finder.loadMore": { pl: "Załaduj więcej", en: "Load more" },
  "outfit.shoes": { pl: "Buty", en: "Shoes" },
  "outfit.bottoms": { pl: "Spodnie", en: "Bottoms" },
  "outfit.tops": { pl: "Koszulka / Bluza", en: "Tops & hoodies" },
  "outfit.acc": { pl: "Czapka / Akcesoria", en: "Caps & accessories" },
  "outfit.kicker": { pl: "Losowanie outfitów", en: "Outfit roll" },
  "outfit.title1": { pl: "Wylosuj", en: "Roll a" },
  "outfit.title2": { pl: "kompletny zestaw", en: "complete fit" },
  "outfit.desc": {
    pl: "Buty · Spodnie · Góra · Czapka / akcesoria — losowane z katalogu.",
    en: "Shoes · Bottoms · Tops · Caps & accessories — rolled from the catalog.",
  },
  "outfit.rolling": { pl: "Losowanie...", en: "Rolling..." },
  "outfit.rollAgain": { pl: "Losuj ponownie 🎲", en: "Roll again 🎲" },
  "outfit.roll": { pl: "Losuj outfit 🎲", en: "Roll outfit 🎲" },
  "outfit.empty": { pl: "Brak produktów w tej kategorii", en: "No products in this category" },
  "outfit.clickRoll": { pl: "Kliknij Losuj", en: "Click Roll" },
  "outfit.preview": { pl: "Podejrzyj", en: "Preview" },
  "outfit.total": { pl: "Łączna cena zestawu", en: "Total fit price" },

  "home.kicker": { pl: "Agent & QC Finds", en: "Agent & QC Finds" },
  "home.title1": { pl: "Znajdź swoje", en: "Find your" },
  "home.title2": { pl: "najlepsze findsy", en: "best finds" },
  "home.subtitle": {
    pl: "Sprawdzone produkty, zdjęcia QC i bezpośrednie linki do zakupu przez Twojego agenta.",
    en: "Verified products, QC photos and direct buy links through your agent.",
  },
  "home.cats": { pl: "Kategorie produktów", en: "Product categories" },
  "home.outfitTitle": {
    pl: "Generator outfitów — wylosuj cały zestaw",
    en: "Outfit generator — roll a full fit",
  },
  "home.outfitDesc": {
    pl: "Buty, spodnie, góra i akcesoria w jednym losowaniu, z ceną w PLN, USD i CNY.",
    en: "Shoes, pants, top and accessories in one roll, priced in PLN, USD and CNY.",
  },
  "home.outfitCta": { pl: "Losuj outfit →", en: "Roll outfit →" },
};

export const DICT_KEYS = Object.keys(DICT);

export const i18nSettingKey = (lang: Lang, key: string) => `i18n_${lang}_${key}`;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "pl",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pl");

  useEffect(() => {
    const saved = safeStorage.get("pkmr_lang");
    if (saved === "en" || saved === "pl") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    safeStorage.set("pkmr_lang", l);
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const { data: settings } = useSettings();

  /** Zwraca tekst: nadpisanie z panelu → domyślny słownik → fallback → klucz. */
  const t = (key: string, fallback?: string) => {
    const override = settings?.[i18nSettingKey(lang, key)];
    if (override && override.trim()) return override;
    return DICT[key]?.[lang] ?? fallback ?? key;
  };

  return { lang, setLang, t };
}
