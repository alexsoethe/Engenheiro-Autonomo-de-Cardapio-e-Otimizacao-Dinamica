import { cn } from "@/lib/utils"
import { BCG_META, type BcgCategory } from "@/lib/menu"
import { BCG_STYLE } from "@/components/bcg-style"

export function CategoryBadge({ categoria, label }: { categoria: BcgCategory; label?: string }) {
  const style = BCG_STYLE[categoria]
  const Icon = style.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        style.badge,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {label ?? BCG_META[categoria].label}
    </span>
  )
}
