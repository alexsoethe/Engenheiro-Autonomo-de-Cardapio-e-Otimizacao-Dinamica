import { cn } from "@/lib/utils"
import { BCG_META, type BcgCategory } from "@/lib/menu"
import type { AiPricing } from "@/lib/parse-ai"
import { BCG_STYLE, categoryFromText } from "@/components/bcg-style"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ORDER: BcgCategory[] = ["quebra", "estrela", "cao", "cavalo"]

export function BcgMatrix({ pricing }: { pricing: AiPricing[] }) {
  const unclassified = pricing.filter((p) => !categoryFromText(p.categoria))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Matriz BCG do cardápio</CardTitle>
        <CardDescription>Classificação de cada prato conforme retornada pela IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="hidden items-center sm:flex" aria-hidden="true">
            <span className="-rotate-180 text-xs font-medium tracking-wide text-muted-foreground uppercase [writing-mode:vertical-rl]">
              Margem de contribuição →
            </span>
          </div>
          <div className="flex-1">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ORDER.map((cat) => {
                const items = pricing.filter((p) => categoryFromText(p.categoria) === cat)
                const style = BCG_STYLE[cat]
                const Icon = style.icon
                return (
                  <li key={cat} className={cn("flex min-h-36 flex-col rounded-xl border p-4", style.panel)}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("flex items-center gap-1.5 text-sm font-semibold", style.text)}>
                          <Icon className="size-4" aria-hidden="true" />
                          {BCG_META[cat].label}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{BCG_META[cat].description}</p>
                      </div>
                      <span className="rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-foreground">
                        {items.length}
                      </span>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {items.length === 0 ? (
                        <li className="text-xs text-muted-foreground italic">Nenhum prato</li>
                      ) : (
                        items.map((i) => (
                          <li
                            key={i.prato}
                            className="rounded-md border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-xs"
                          >
                            {i.prato}
                          </li>
                        ))
                      )}
                    </ul>
                    <p className="mt-auto pt-3 text-xs font-medium text-foreground/80">→ {BCG_META[cat].action}</p>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase" aria-hidden="true">
              Popularidade (vendas) →
            </p>
            {unclassified.length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Sem categoria reconhecida:{" "}
                {unclassified.map((p) => `${p.prato}${p.categoria ? ` (${p.categoria})` : ""}`).join(", ")}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
