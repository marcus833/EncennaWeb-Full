"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, Search, Download, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AdicionarMaterialForm } from "./adicionarMaterial"

interface Material {
  _id: string;
  titulo: string;
  autor?: string;
  arquivo?: string;
  tipo: "Partitura" | "Roteiro" | "Livro" | "Outro";
  createdAt: string; 
}

const BibliotecaDigital = () => {
  const router = useRouter()
  
  const [materiais, setMateriais] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMateriais = async () => {
    if (!loading) setLoading(true); 
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Usuário não autenticado.");
      
      const response = await fetch("http://localhost:3001/api/biblioteca/listarMateriais", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Falha ao buscar os materiais.");

      const data: Material[] = await response.json();
      setMateriais(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const filteredMateriais = materiais.filter(material => 
    material.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const navigationItems = [
    { icon: GraduationCap, label: "Gestão Acadêmica", path: "/gestaoacademica" },
    { icon: Book, label: "Biblioteca Digital", path: "/biblioteca", active: true },
    { icon: Music, label: "Audições", path: "/audicoes" },
    { icon: Calendar, label: "Ensaios", path: "/ensaios" },
    { icon: DollarSign, label: "Financeiro", path: "/financeiro" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg shrink-0">
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
                <Button key={index} variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${item.active ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => router.push(item.path)}>
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Biblioteca Digital</h1>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Adicionar Material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Material</DialogTitle>
                </DialogHeader>
                <AdicionarMaterialForm 
                  onSuccess={fetchMateriais}
                  onClose={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Pesquisar por título..." 
              className="pl-10 h-12 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p className="text-center">Carregando materiais...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMateriais.map((material) => (
                <Card key={material._id} className="flex flex-col">
                  {material.tipo === 'Livro' && material.arquivo && (
                    <div className="h-40 w-full overflow-hidden bg-gray-200 flex justify-center items-center border-b">
                        <img src={material.arquivo} alt={`Capa de ${material.titulo}`} className="h-full w-auto" />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{material.titulo}</CardTitle>
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded shrink-0">
                        {material.tipo}
                      </div>
                    </div>
                    {material.autor && <CardDescription className="text-sm text-gray-600 mt-1">por {material.autor}</CardDescription>}
                  </CardHeader>
                  <CardContent className="p-4 border-t mt-auto">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-gray-500">
                        Adicionado em {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                       </span>
                       <a href={material.arquivo} target="_blank" rel="noopener noreferrer" className={!material.arquivo ? "pointer-events-none" : ""}>
                          <Button variant="outline" size="sm" className="gap-2" disabled={!material.arquivo}>
                            <Download className="h-4 w-4" />
                            {material.tipo === 'Livro' ? 'Ver Capa' : 'Download'}
                          </Button>
                       </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default BibliotecaDigital