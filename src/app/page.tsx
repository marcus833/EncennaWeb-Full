"use client"
import Image from "next/image";

import { useRouter } from "next/router"
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const Configuracoes = () => {
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
      active: true,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* User Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <Input type="text" placeholder="Digite seu nome" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <Input type="tel" placeholder="(00) 00000-0000" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <Input type="date" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <Input type="email" placeholder="seu@email.com" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <Input type="text" placeholder="000.000.000-00" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <Input type="password" placeholder="Digite sua senha" className="h-12" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button variant="outline" className="h-12 px-8">
                  Salvar Alterações
                </Button>

                <Button variant="destructive" className="h-12 px-8 gap-2" onClick={() => router.push("/")}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Configuracoes
