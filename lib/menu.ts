export type BcgCategory = "estrela" | "vaca" | "interrogacao" | "abacaxi"

export type MenuItem = {
  prato: string
  custo: number
  preco: number
  vendas: number
  margem: number
  margemPct: number
  lucroTotal: number
  categoria: BcgCategory
}

export type MenuAnalysis = {
  items: MenuItem[]
  mediaVendas: number
  mediaMargem: number
  faturamento: number
  lucroTotal: number
  errors: string[]
}

export const BCG_META: Record<
  BcgCategory,
  { label: string; description: string; action: string }
> = {
  estrela: {
    label: "Estrela",
    description: "Alta popularidade e alta margem",
    action: "Manter destaque e proteger o preço",
  },
  vaca: {
    label: "Vaca Leiteira",
    description: "Alta popularidade, margem baixa",
    action: "Reajustar preço ou reduzir custo",
  },
  interrogacao: {
    label: "Interrogação",
    description: "Margem alta, pouca venda",
    action: "Promover e reposicionar no cardápio",
  },
  abacaxi: {
    label: "Abacaxi",
    description: "Baixa popularidade e baixa margem",
    action: "Reformular ou retirar do cardápio",
  },
}

export const DEFAULT_CSV = `prato,custo,preco,vendas_mes
Margherita,15,45,300
Calabresa,18,48,420
Trufa Negra,35,85,40
Atum,25,42,35`

export const BURGER_EXAMPLE = {
  restaurante: "Brasa Burger Co.",
  cidade: "Curitiba",
  csv: `prato,custo,preco,vendas_mes
Smash Clássico,12,32,520
Cheddar Bacon,16,39,380
Wagyu Trufado,38,79,45
Veggie Grão-de-Bico,11,34,60
Batata Rústica,4,18,610
Milkshake Ovomaltine,7,24,140`,
}

function toNumber(value: string) {
  return Number(value.trim().replace(/^R\$\s*/i, "").replace(",", "."))
}

export function analyzeMenu(csv: string): MenuAnalysis {
  const errors: string[] = []
  const lines = csv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return { items: [], mediaVendas: 0, mediaMargem: 0, faturamento: 0, lucroTotal: 0, errors: ["Informe o cabeçalho e ao menos um prato."] }
  }

  const delimiter = lines[0].includes(";") ? ";" : ","
  const header = lines[0].toLowerCase().split(delimiter).map((h) => h.trim())
  const idx = {
    prato: header.findIndex((h) => h.startsWith("prato") || h === "nome"),
    custo: header.findIndex((h) => h.startsWith("custo")),
    preco: header.findIndex((h) => h.startsWith("preco") || h.startsWith("preço")),
    vendas: header.findIndex((h) => h.startsWith("vendas")),
  }

  if (Object.values(idx).some((i) => i === -1)) {
    return { items: [], mediaVendas: 0, mediaMargem: 0, faturamento: 0, lucroTotal: 0, errors: ["Cabeçalho esperado: prato,custo,preco,vendas_mes"] }
  }

  const raw = lines.slice(1).flatMap((line, i) => {
    const cols = line.split(delimiter)
    const prato = cols[idx.prato]?.trim()
    const custo = toNumber(cols[idx.custo] ?? "")
    const preco = toNumber(cols[idx.preco] ?? "")
    const vendas = toNumber(cols[idx.vendas] ?? "")
    if (!prato || [custo, preco, vendas].some((n) => Number.isNaN(n))) {
      errors.push(`Linha ${i + 2} ignorada: valores inválidos.`)
      return []
    }
    return [{ prato, custo, preco, vendas }]
  })

  const totalVendas = raw.reduce((s, r) => s + r.vendas, 0)
  const mediaVendas = raw.length ? totalVendas / raw.length : 0
  // Weighted average contribution margin, the standard menu-engineering threshold.
  const mediaMargem = totalVendas
    ? raw.reduce((s, r) => s + (r.preco - r.custo) * r.vendas, 0) / totalVendas
    : 0

  const items: MenuItem[] = raw.map((r) => {
    const margem = r.preco - r.custo
    const popular = r.vendas >= mediaVendas
    const rentavel = margem >= mediaMargem
    const categoria: BcgCategory = popular
      ? rentavel
        ? "estrela"
        : "vaca"
      : rentavel
        ? "interrogacao"
        : "abacaxi"
    return {
      ...r,
      margem,
      margemPct: r.preco ? (margem / r.preco) * 100 : 0,
      lucroTotal: margem * r.vendas,
      categoria,
    }
  })

  return {
    items,
    mediaVendas,
    mediaMargem,
    faturamento: items.reduce((s, i) => s + i.preco * i.vendas, 0),
    lucroTotal: items.reduce((s, i) => s + i.lucroTotal, 0),
    errors,
  }
}

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
