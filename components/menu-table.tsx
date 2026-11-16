import { brl, type MenuAnalysis } from "@/lib/menu"
import { CategoryBadge } from "@/components/category-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function MenuTable({ analysis }: { analysis: MenuAnalysis }) {
  const sorted = [...analysis.items].sort((a, b) => b.lucroTotal - a.lucroTotal)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Detalhamento por prato</CardTitle>
        <CardDescription>Ordenado por lucro bruto mensal.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="pb-2 font-medium">Prato</th>
              <th scope="col" className="pb-2 text-right font-medium">Custo</th>
              <th scope="col" className="pb-2 text-right font-medium">Preço</th>
              <th scope="col" className="pb-2 text-right font-medium">Margem</th>
              <th scope="col" className="pb-2 text-right font-medium">Vendas</th>
              <th scope="col" className="pb-2 text-right font-medium">Lucro/mês</th>
              <th scope="col" className="pb-2 pl-4 font-medium">Matriz</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((i) => (
              <tr key={i.prato} className="border-b last:border-0">
                <th scope="row" className="py-3 text-left font-medium">{i.prato}</th>
                <td className="py-3 text-right tabular-nums text-muted-foreground">{brl(i.custo)}</td>
                <td className="py-3 text-right tabular-nums">{brl(i.preco)}</td>
                <td className="py-3 text-right tabular-nums">
                  {brl(i.margem)}
                  <span className="ml-1 text-xs text-muted-foreground">({i.margemPct.toFixed(0)}%)</span>
                </td>
                <td className="py-3 text-right tabular-nums">{i.vendas.toLocaleString("pt-BR")}</td>
                <td className="py-3 text-right font-semibold tabular-nums">{brl(i.lucroTotal)}</td>
                <td className="py-3 pl-4">
                  <CategoryBadge categoria={i.categoria} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
