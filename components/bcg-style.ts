import { Star, Tractor, Puzzle, Dog, type LucideIcon } from "lucide-react"
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
  cavalo: {
    icon: Tractor,
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
    panel: "bg-sky-50/60 border-sky-200",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  quebra: {
    icon: Puzzle,
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    panel: "bg-amber-50/60 border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  cao: {
    icon: Dog,
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
  if (t.includes("cavalo") || t.includes("arado") || t.includes("plowhorse") || t.includes("vaca") || t.includes("cash")) return "cavalo"
  if (t.includes("quebra") || t.includes("puzzle") || t.includes("interroga") || t.includes("question")) return "quebra"
  if (/\bcao\b/.test(t) || t.includes("dog") || t.includes("cachorro") || t.includes("abacaxi")) return "cao"
  return undefined
}
