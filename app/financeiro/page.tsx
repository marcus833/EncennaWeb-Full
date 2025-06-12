"use client"

import { useRouter } from "next/navigation"
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const Financeiro = () => {
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
      active: true,
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
          <h2
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => router.push("/home")}
          >
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
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    item.active ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Mensalidades</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meses.map((mes, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-medium text-gray-800">{mes}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <FileText className="h-4 w-4" />
                    Gerar Boleto
                  </Button>
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo Financeiro</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Mensalidades Pagas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Em Atraso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Financeiro
