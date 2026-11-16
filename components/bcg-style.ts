import { Star, Milk, CircleHelp, TrendingDown, type LucideIcon } from "lucide-react"
import type { BcgCategory } from "@/lib/menu"

export const BCG_STYLE: Record<
  BcgCategory,
  { icon: LucideIcon; badge: string; panel: string; dot: string; text: string }
> = {
  estrela: {
    icon: Star,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    panel: "bg-emerald-50/60 border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  vaca: {
    icon: Milk,
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
    panel: "bg-sky-50/60 border-sky-200",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  interrogacao: {
    icon: CircleHelp,
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    panel: "bg-amber-50/60 border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  abacaxi: {
    icon: TrendingDown,
    badge: "bg-stone-100 text-stone-700 ring-stone-500/20",
    panel: "bg-stone-50 border-stone-200",
    dot: "bg-stone-400",
    text: "text-stone-700",
  },
}

export function categoryFromText(text?: string): BcgCategory | undefined {
  if (!text) return undefined
  const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  if (t.includes("estrela") || t.includes("star")) return "estrela"
  if (t.includes("vaca") || t.includes("cash") || t.includes("burro")) return "vaca"
  if (t.includes("interroga") || t.includes("question") || t.includes("quebra") || t.includes("puzzle")) return "interrogacao"
  if (t.includes("abacaxi") || t.includes("dog") || t.includes("cachorro") || /\bcao\b/.test(t)) return "abacaxi"
  return undefined
}
