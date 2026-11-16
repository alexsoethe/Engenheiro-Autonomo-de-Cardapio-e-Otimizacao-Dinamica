import { CloudSun, Sparkles, ArrowRight, AlertTriangle } from "lucide-react"
import { brl } from "@/lib/menu"
import type { AiResult } from "@/lib/parse-ai"
import { CategoryBadge } from "@/components/category-badge"
import { categoryFromText } from "@/components/bcg-style"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AiInsights({ result, error, cidade }: { result: AiResult | null; error: string | null; cidade: string }) {
  if (error) {
    return (
      <div role="alert" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">Não foi possível obter a análise da IA</p>
          <p className="mt-1 text-amber-800">{error} Tente novamente para gerar a Matriz BCG.</p>
        </div>
      </div>
    )
  }
  if (!result) return null

  const { clima, pricing, resumo, extras, rawText } = result
  const hasContent = clima || pricing.length || resumo.length || extras.length || rawText

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          Recomendações da IA
        </CardTitle>
        <CardDescription>Precificação dinâmica considerando clima e desempenho do cardápio.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {!hasContent && <p className="text-sm text-muted-foreground">A IA não retornou conteúdo para exibir.</p>}

        {clima && (
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <CloudSun className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="text-xs text-muted-foreground">Clima em {clima.cidade || cidade}</p>
              <p className="font-medium">
                {[clima.temperatura && `${clima.temperatura}${/\d$/.test(clima.temperatura) ? "°C" : ""}`, clima.condicao, clima.texto]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </div>
        )}

        {pricing.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {pricing.map((p) => {
              const cat = categoryFromText(p.categoria)
              const delta = p.precoAtual && p.precoSugerido ? ((p.precoSugerido - p.precoAtual) / p.precoAtual) * 100 : null
              return (
                <li key={p.prato} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{p.prato}</p>
                    {cat ? (
                      <CategoryBadge categoria={cat} label={p.categoria} />
                    ) : (
                      p.categoria && <span className="text-xs text-muted-foreground">{p.categoria}</span>
                    )}
                  </div>
                  {p.precoSugerido !== undefined && (
                    <div className="flex items-center gap-2 text-sm tabular-nums">
                      {p.precoAtual !== undefined && (
                        <>
                          <span className="text-muted-foreground line-through">{brl(p.precoAtual)}</span>
                          <ArrowRight className="size-3.5 text-muted-foreground" aria-label="para" />
                        </>
                      )}
                      <span className="text-lg font-semibold">{brl(p.precoSugerido)}</span>
                      {delta !== null && (
                        <span
                          className={
                            delta >= 0
                              ? "rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700"
                              : "rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                          }
                        >
                          {delta >= 0 ? "+" : ""}
                          {delta.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                  {p.justificativa && <p className="text-sm leading-relaxed text-muted-foreground">{p.justificativa}</p>}
                </li>
              )
            })}
          </ul>
        )}

        {resumo.length > 0 && (
          <div className="flex flex-col gap-2">
            {resumo.map((r, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-line text-pretty">
                {r}
              </p>
            ))}
          </div>
        )}

        {extras.length > 0 && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {extras.map((e) => (
              <div key={e.label} className="rounded-xl border bg-card p-3">
                <dt className="text-xs font-medium text-muted-foreground capitalize">{e.label}</dt>
                <dd className="mt-1 text-sm whitespace-pre-line">{e.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {rawText && <p className="text-sm leading-relaxed whitespace-pre-line text-pretty">{rawText}</p>}
      </CardContent>
    </Card>
  )
}
