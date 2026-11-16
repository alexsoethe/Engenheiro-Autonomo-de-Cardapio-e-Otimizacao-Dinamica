const WEBHOOK_URL = "https://hook.us2.make.com/g8on729mjh6frqujd99wl6zkl7attysj"

export const maxDuration = 120

export async function POST(request: Request) {
  let body: { restaurante?: unknown; cidade?: unknown; csv_data?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 })
  }

  const { restaurante, cidade, csv_data } = body
  if (
    typeof restaurante !== "string" ||
    typeof cidade !== "string" ||
    typeof csv_data !== "string" ||
    !restaurante.trim() ||
    !cidade.trim() ||
    !csv_data.trim() ||
    csv_data.length > 50_000
  ) {
    return Response.json({ error: "Preencha restaurante, cidade e CSV válidos." }, { status: 400 })
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurante: restaurante.trim(),
        cidade: cidade.trim(),
        csv_data: csv_data.trim(),
      }),
      signal: AbortSignal.timeout(110_000),
    })
    const text = await res.text()
    if (!res.ok) {
      return Response.json(
        { error: `O webhook respondeu com status ${res.status}.`, raw: text },
        { status: 502 },
      )
    }
    return Response.json({ raw: text })
  } catch {
    return Response.json({ error: "Não foi possível contatar o webhook da IA." }, { status: 504 })
  }
}
