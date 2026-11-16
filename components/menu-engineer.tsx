"use client"

import { useState } from "react"
import { LayoutGrid } from "lucide-react"
import { analyzeMenu, BURGER_EXAMPLE, DEFAULT_CSV, type MenuAnalysis } from "@/lib/menu"
import { parseAiResponse, type AiResult } from "@/lib/parse-ai"
import { AnalysisForm, type FormValues } from "@/components/analysis-form"
import { KpiCards } from "@/components/kpi-cards"
import { BcgMatrix } from "@/components/bcg-matrix"
import { MenuTable } from "@/components/menu-table"
import { AiInsights } from "@/components/ai-insights"

export function MenuEngineer() {
  const [values, setValues] = useState<FormValues>({
    restaurante: "Pizzaria Bella Napoli",
    cidade: "São Paulo",
    csv: DEFAULT_CSV,
  })
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<MenuAnalysis | null>(null)
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const [aiResult, setAiResult] = useState<AiResult | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [csvError, setCsvError] = useState<string | null>(null)

  async function handleSubmit() {
    const local = analyzeMenu(values.csv)
    if (!local.items.length) {
      setCsvError(local.errors[0] ?? "Não encontramos pratos válidos no CSV.")
      return
    }
    setCsvError(null)
    setLoading(true)
    setAiResult(null)
    setAiError(null)
    setAnalysis(local)
    setSubmitted(values)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurante: values.restaurante, cidade: values.cidade, csv_data: values.csv }),
      })
      const data: { raw?: string; error?: string } = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? "Erro inesperado.")
      setAiResult(parseAiResponse(data.raw ?? ""))
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      <div className="flex flex-col gap-3">
        <AnalysisForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          onLoadExample={() => setValues(BURGER_EXAMPLE)}
          loading={loading}
        />
        {csvError && (
          <p role="alert" className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
            {csvError}
          </p>
        )}
      </div>

      <section aria-live="polite" aria-busy={loading} className="flex min-w-0 flex-col gap-6">
        {!analysis ? (
          <EmptyState />
        ) : (
          <>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Relatório</p>
              <h2 className="text-xl font-semibold tracking-tight text-balance">
                {submitted?.restaurante} · {submitted?.cidade}
              </h2>
            </div>
            <KpiCards analysis={analysis} />
            {loading ? <AiSkeleton /> : <AiInsights result={aiResult} error={aiError} cidade={submitted?.cidade ?? ""} />}
            {loading ? (
              <AiSkeleton />
            ) : aiResult?.pricing.length ? (
              <>
                <BcgMatrix pricing={aiResult.pricing} />
                <MenuTable pricing={aiResult.pricing} />
              </>
            ) : (
              !aiError && (
                <p className="rounded-xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
                  A IA não retornou a classificação BCG dos pratos.
                </p>
              )
            )}
            {analysis.errors.length > 0 && (
              <ul className="text-xs text-muted-foreground">
                {analysis.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed bg-card p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LayoutGrid className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-semibold">Seu relatório aparecerá aqui</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
        Envie o cardápio para classificar cada prato na Matriz BCG e receber sugestões de preço baseadas no clima da
        sua cidade.
      </p>
    </div>
  )
}

function AiSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6" aria-label="Carregando análise da IA">
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-3 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
