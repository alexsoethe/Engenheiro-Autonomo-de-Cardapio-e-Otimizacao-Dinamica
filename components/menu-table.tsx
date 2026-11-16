import { brl } from "@/lib/menu"
import type { AiPricing } from "@/lib/parse-ai"
import { CategoryBadge } from "@/components/category-badge"
import { categoryFromText } from "@/components/bcg-style"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function MenuTable({ pricing }: { pricing: AiPricing[] }) {
  const hasJustificativa = pricing.some((p) => p.justificativa)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalhamento por prato</CardTitle>
        <CardDescription>Categorias e preços retornados pela IA.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="pb-2 font-medium">Prato</th>
              <th scope="col" className="pb-2 font-medium">Categoria</th>
              <th scope="col" className="pb-2 text-right font-medium">Preço atual</th>
              <th scope="col" className="pb-2 text-right font-medium">Preço sugerido</th>
              <th scope="col" className="pb-2 text-right font-medium">Variação</th>
              {hasJustificativa && <th scope="col" className="pb-2 pl-4 font-medium">Justificativa</th>}
            </tr>
          </thead>
          <tbody>
            {pricing.map((p) => {
              const cat = categoryFromText(p.categoria)
              const delta =
                p.precoAtual && p.precoSugerido !== undefined
                  ? ((p.precoSugerido - p.precoAtual) / p.precoAtual) * 100
                  : null
              return (
                <tr key={p.prato} className="border-b align-top last:border-0">
                  <th scope="row" className="py-3 pr-3 text-left font-medium">{p.prato}</th>
                  <td className="py-3 pr-3">
                    {cat ? (
                      <CategoryBadge categoria={cat} />
                    ) : (
                      <span className="text-xs text-muted-foreground">{p.categoria ?? "—"}</span>
                    )}
                  </td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">
                    {p.precoAtual !== undefined ? brl(p.precoAtual) : "—"}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {p.precoSugerido !== undefined ? brl(p.precoSugerido) : "—"}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {delta === null ? (
                      "—"
                    ) : (
                      <span className={delta >= 0 ? "text-emerald-600" : "text-primary"}>
                        {delta >= 0 ? "+" : ""}
                        {delta.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  {hasJustificativa && (
                    <td className="max-w-xs py-3 pl-4 text-xs leading-relaxed text-muted-foreground">
                      {p.justificativa ?? "—"}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
