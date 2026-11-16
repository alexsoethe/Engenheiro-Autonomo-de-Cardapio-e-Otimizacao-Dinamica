"use client"

import { Loader2, Sparkles, Beef, Store, MapPin, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type FormValues = { restaurante: string; cidade: string; csv: string }

type Props = {
  values: FormValues
  onChange: (values: FormValues) => void
  onSubmit: () => void
  onLoadExample: () => void
  loading: boolean
}

export function AnalysisForm({ values, onChange, onSubmit, onLoadExample, loading }: Props) {
  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...values, [key]: e.target.value })

  return (
    <Card className="lg:sticky lg:top-6">
      <CardHeader>
        <CardTitle className="text-base">Dados do restaurante</CardTitle>
        <CardDescription>Informe a cidade para cruzar o clima com a demanda do cardápio.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="restaurante" className="flex items-center gap-1.5">
              <Store className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Nome do Restaurante
            </Label>
            <Input id="restaurante" value={values.restaurante} onChange={set("restaurante")} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cidade" className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Cidade
            </Label>
            <Input id="cidade" value={values.cidade} onChange={set("cidade")} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="csv" className="flex items-center gap-1.5">
              <FileSpreadsheet className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Dados do Cardápio (CSV)
            </Label>
            <Textarea
              id="csv"
              rows={6}
              value={values.csv}
              onChange={set("csv")}
              spellCheck={false}
              required
              aria-describedby="csv-help"
              className="font-mono text-xs leading-relaxed"
            />
            <p id="csv-help" className="text-xs text-muted-foreground">
              Colunas: <code className="font-mono">prato,custo,preco,vendas_mes</code>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" disabled={loading} className="h-11 w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  <span className="truncate">Consultando clima e calculando Matriz BCG...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Analisar Cardápio com IA
                </>
              )}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={onLoadExample} className="w-full">
              <Beef className="size-4" aria-hidden="true" />
              Carregar Exemplo Hamburgueria
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
