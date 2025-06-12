"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, Plus, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Ensaios = () => {
  const router = useRouter()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

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
      active: true,
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

  const ensaiosAgendados = [
    {
      id: 1,
      data: "2024-01-15",
      horario: "14:00 - 16:00",
      local: "Sala de Ensaio A",
      peca: "Sonata No. 14",
      participantes: "João, Maria, Pedro",
    },
    {
      id: 2,
      data: "2024-01-18",
      horario: "10:00 - 12:00",
      local: "Auditório Principal",
      peca: "Concerto em Dó Maior",
      participantes: "Ana, Carlos, Sofia",
    },
    {
      id: 3,
      data: "2024-01-22",
      horario: "16:00 - 18:00",
      local: "Sala de Ensaio B",
      peca: "Quarteto de Cordas",
      participantes: "Lucas, Beatriz, Rafael, Camila",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Ensaio agendado!")
    setMostrarFormulario(false)
  }

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Agendamento de Ensaios</h1>
            <Button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Ensaio
            </Button>
          </div>

          {mostrarFormulario && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Agendar Novo Ensaio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Data do Ensaio</label>
                      <Input type="date" className="h-12" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Horário</label>
                      <div className="flex items-center gap-2">
                        <Input type="time" className="h-12" />
                        <span className="text-gray-500">—</span>
                        <Input type="time" className="h-12" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Local</label>
                      <Input type="text" placeholder="Ex: Sala de Ensaio A" className="h-12" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Peça relacionada</label>
                      <Input type="text" placeholder="Ex: Sonata No. 14" className="h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Participantes</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={4}
                      placeholder="Liste os participantes do ensaio..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar Ensaio</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ensaiosAgendados.map((ensaio) => (
              <Card key={ensaio.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-gray-800">{ensaio.peca}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(ensaio.data).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{ensaio.horario}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{ensaio.local}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{ensaio.participantes}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Ensaios
