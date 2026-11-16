import { ChefHat } from "lucide-react"
import { MenuEngineer } from "@/components/menu-engineer"

export default function Page() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-5 sm:px-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ChefHat className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">AI Menu Engineer</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Engenharia de cardápio com IA, clima em tempo real e Matriz BCG
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <MenuEngineer />
      </main>
    </div>
  )
}
