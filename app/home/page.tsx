"use client"

import { useRouter } from "next/navigation"
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Home = () => {
  const router = useRouter()

  const navigationItems = [
    {
      icon: GraduationCap,
      label: "Gestão Acadêmica",
      path: "/gestaoacademica",
    },
    {
      icon: Book,
      label: "Biblioteca Digital",
      path: "/biblioteca",
    },
    {
      icon: Music,
      label: "Audições",
      path: "/audicoes",
    },
    {
      icon: Calendar,
      label: "Ensaios",
      path: "/ensaios",
    },
    {
      icon: DollarSign,
      label: "Financeiro",
      path: "/financeiro",
    },
    {
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Encenna
            <br />
            <small className="text-sm font-normal text-gray-600">Digital</small>
          </h2>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push(item.path)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo à Plataforma Encenna Digital</h1>
            <p className="text-gray-600 text-lg">
              Selecione uma funcionalidade no menu lateral para começar a explorar os recursos disponíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => router.push(item.path)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg font-medium text-gray-800">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 text-center">{getDescription(item.label)}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

const getDescription = (label: string) => {
  const descriptions = {
    "Gestão Acadêmica": "Gerencie alunos, professores e cursos",
    "Biblioteca Digital": "Acesse partituras e materiais didáticos",
    Audições: "Organize e acompanhe audições",
    Ensaios: "Agende e gerencie ensaios",
    Financeiro: "Controle financeiro e mensalidades",
    Configurações: "Ajustes pessoais e do sistema",
  }
  return descriptions[label as keyof typeof descriptions] || "Funcionalidade do sistema"
}

export default Home
