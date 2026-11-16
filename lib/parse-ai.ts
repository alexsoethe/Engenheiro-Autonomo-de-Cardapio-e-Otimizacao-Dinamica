type Json = Record<string, unknown>

export type AiPricing = {
  prato: string
  categoria?: string
  precoAtual?: number
  precoSugerido?: number
  justificativa?: string
}

export type AiResult = {
  clima?: { cidade?: string; temperatura?: string; condicao?: string; texto?: string }
  pricing: AiPricing[]
  resumo: string[]
  extras: { label: string; value: string }[]
  rawText?: string
}

const norm = (k: string) =>
  k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")

function isObj(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function pick(obj: Json, keys: string[]): unknown {
  const wanted = keys.map(norm)
  for (const [k, v] of Object.entries(obj)) {
    if (wanted.includes(norm(k)) && v !== null && v !== "") return v
  }
  return undefined
}

function toNum(v: unknown) {
  if (typeof v === "number") return v
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d,.-]/g, "").replace(",", "."))
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

function toText(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined
  if (typeof v === "string") return v
  if (typeof v === "number" || typeof v === "boolean") return String(v)
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join("\n")
  return Object.entries(v as Json)
    .map(([k, val]) => `${k}: ${toText(val)}`)
    .join("\n")
}

function tryParse(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim()
  try {
    const parsed = JSON.parse(cleaned)
    return typeof parsed === "string" ? tryParse(parsed) : parsed
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {}
    }
    return cleaned
  }
}

const ITEM_KEYS = ["itens", "items", "pratos", "cardapio", "menu", "resultados", "analise", "matriz", "matrizbcg", "precificacao"]
const CLIMA_KEYS = ["clima", "weather", "tempo", "climaatual"]
const RESUMO_KEYS = ["resumo", "summary", "analise", "insight", "insights", "recomendacao", "recomendacoes", "estrategia", "mensagem", "conclusao", "observacoes", "dicas"]

function parseItem(v: unknown): AiPricing | null {
  if (!isObj(v)) return null
  const prato = toText(pick(v, ["prato", "nome", "name", "item", "produto"]))
  if (!prato) return null
  return {
    prato,
    categoria: toText(pick(v, ["categoria", "classificacao", "bcg", "quadrante", "categoriabcg", "classificacaobcg", "tipo"])),
    precoAtual: toNum(pick(v, ["precoatual", "preco", "precoorigem", "precooriginal", "price"])),
    precoSugerido: toNum(pick(v, ["precosugerido", "novopreco", "precodinamico", "precoideal", "precorecomendado", "suggestedprice", "novoprecosugerido"])),
    justificativa: toText(pick(v, ["justificativa", "sugestao", "acao", "motivo", "recomendacao", "estrategia", "observacao", "reason"])),
  }
}

export function parseAiResponse(raw: string): AiResult {
  const data = tryParse(raw)
  const result: AiResult = { pricing: [], resumo: [], extras: [] }

  if (!isObj(data)) {
    if (Array.isArray(data)) {
      result.pricing = data.map(parseItem).filter((i): i is AiPricing => !!i)
      if (result.pricing.length) return result
    }
    result.rawText = toText(data)?.trim() || undefined
    return result
  }

  const used = new Set<string>()
  const markUsed = (keys: string[]) => {
    for (const k of Object.keys(data)) if (keys.map(norm).includes(norm(k))) used.add(k)
  }

  for (const key of ITEM_KEYS) {
    const v = pick(data, [key])
    if (Array.isArray(v)) {
      const parsed = v.map(parseItem).filter((i): i is AiPricing => !!i)
      if (parsed.length) {
        result.pricing = parsed
        markUsed([key])
        break
      }
    }
  }

  const clima = pick(data, CLIMA_KEYS)
  const temperatura = pick(data, ["temperatura", "temp", "temperature"])
  if (clima !== undefined || temperatura !== undefined) {
    markUsed([...CLIMA_KEYS, "temperatura", "temp", "temperature", "cidade"])
    if (isObj(clima)) {
      result.clima = {
        cidade: toText(pick(clima, ["cidade", "city"])),
        temperatura: toText(pick(clima, ["temperatura", "temp", "temperature"])),
        condicao: toText(pick(clima, ["condicao", "descricao", "description", "condition", "tempo"])),
      }
    } else {
      result.clima = { texto: toText(clima), temperatura: toText(temperatura), cidade: toText(pick(data, ["cidade"])) }
    }
  }

  for (const key of RESUMO_KEYS) {
    if (used.has(key)) continue
    const v = pick(data, [key])
    if (v !== undefined && !(Array.isArray(v) && v.some(isObj))) {
      const text = Array.isArray(v) ? v.map(toText).filter(Boolean) : [toText(v)]
      result.resumo.push(...(text.filter(Boolean) as string[]))
      markUsed([key])
    }
  }

  for (const [k, v] of Object.entries(data)) {
    if (used.has(k)) continue
    const text = toText(v)
    if (text) result.extras.push({ label: k.replace(/_/g, " "), value: text })
  }

  return result
}
