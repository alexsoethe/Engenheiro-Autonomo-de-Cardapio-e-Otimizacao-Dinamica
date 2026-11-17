# 🍽️ AI Menu Engineer — Precificação Dinâmica & Matriz BCG

Aplicação *end-to-end* de Engenharia de Cardápio impulsionada por Inteligência Artificial Generativa, dados climáticos em tempo real e análise financeira automatizada para operações de delivery e restaurantes.

🔗 **Aplicação em Produção (Live Demo):** https://engenheiro-autonomo-de-cardapio-e-o.vercel.app

---

## 🎯 Problema de Negócio
Pequenos e médios restaurantes frequentemente precificam seus itens sem cruzar margem de contribuição unitária, volume de saída (Matriz BCG) e variáveis externas imediatas — como temperatura e chuva na cidade do pedido, que alteram diretamente a elasticidade e a demanda no delivery.

## 🏗️ Arquitetura & Fluxo Agêntico

O projeto separa a interface de apresentação da camada de orquestração e segurança de chaves:

1. **Frontend (Next.js, TypeScript, Tailwind CSS & Shadcn UI — Vercel):**
   - Ingestão de dados de cardápio via CSV (`prato, custo, preco, vendas_mes`) e cidade do estabelecimento.
   - Comunicação síncrona via Webhook REST com renderização dinâmica de KPIs, tabela de precificação e quadrantes visuais da Matriz BCG.
2. **Orquestração & Function Calling (Make.com + Gemini 3.1 Flash-Lite):**
   - **Etapa 1 (Tool Calling):** O agente interpreta a cidade informada e extrai coordenadas geográficas (`latitude` e `longitude`) em formato estruturado.
   - **Etapa 2 (Contexto Externo):** Consulta em tempo real à API **Open-Meteo** para obter temperatura atual (`°C`) e precipitação (`mm`).
   - **Etapa 3 (Análise & Structured Outputs):** O modelo cruza margem de contribuição (`Preço - Custo`), giro de vendas e clima local, aplicando raciocínio estratégico (*Chain-of-Thought*) e garantindo o contrato de resposta via `responseSchema` em JSON estrito.
3. **Persistência & Auditoria (Supabase / PostgreSQL):**
   - Cada análise executada é armazenada automaticamente na tabela `analises_cardapio` com timestamp UTC e histórico completo para rastreabilidade.

## 📊 Classificação da Matriz BCG Aplicada
- ⭐ **Estrela:** Alta popularidade e alta margem (proteger preço e maximizar destaque).
- 🚜 **Cavalo de Arado:** Alta popularidade e margem moderada/baixa (gerar fluxo sem descontos agressivos).
- 🧩 **Quebra-cabeça:** Baixa popularidade e alta margem (promover via combos, fotos e posicionamento).
- 🐕 **Cão:** Baixa popularidade e baixa margem (reajustar preço, revisar ficha técnica ou remover).

## 🛠️ Stack Tecnológica
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, v0.dev, Vercel
- **Orquestração & Automação:** Make.com (Webhooks & REST APIs)
- **IA Generativa:** Google Gemini 3.1 Flash-Lite (`v1beta` REST API, Tool Calling, Structured Outputs)
- **Dados Externos & Banco:** Open-Meteo Weather API, Supabase (PostgreSQL)
