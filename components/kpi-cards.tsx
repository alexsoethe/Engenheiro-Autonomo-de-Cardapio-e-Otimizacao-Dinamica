import { Wallet, PiggyBank, ShoppingBag, Percent } from "lucide-react"
import { brl, type MenuAnalysis } from "@/lib/menu"

export function KpiCards({ analysis }: { analysis: MenuAnalysis }) {
  const totalVendas = analysis.items.reduce((s, i) => s + i.vendas, 0)
  const margemMedia = analysis.faturamento ? (analysis.lucroTotal / analysis.faturamento) * 100 : 0
  const kpis = [
    { label: "Faturamento / mês", value: brl(analysis.faturamento), icon: Wallet },
    { label: "Lucro bruto / mês", value: brl(analysis.lucroTotal), icon: PiggyBank },
    { label: "Pratos vendidos", value: totalVendas.toLocaleString("pt-BR"), icon: ShoppingBag },
    { label: "Margem média", value: `${margemMedia.toFixed(1)}%`, icon: Percent },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <k.icon className="size-3.5" aria-hidden="true" />
            {k.label}
          </dt>
          <dd className="mt-2 text-xl font-semibold tracking-tight tabular-nums">{k.value}</dd>
        </div>
      ))}
    </dl>
  )
}
