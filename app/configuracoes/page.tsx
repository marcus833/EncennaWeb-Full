"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DadosPessoaisForm } from "@/components/configuracoes/DadosPessoais";
import { AlterarSenhaForm } from "@/components/configuracoes/AlterarSenhaForm";

interface UserInfo {
  id: string; nome: string; email: string; telefone: string; cpf: string; tipo: string; fotoPerfil?: string;
}

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("userInfo");
    if (userJson) {
      setUserInfo(JSON.parse(userJson));
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    router.push("/");
  };
  
  const allNavigationItems = [
    { icon: GraduationCap, label: "Gestão Acadêmica", path: "/gestaoacademica", adminOnly: false },
    { icon: UserPlus,      label: "Cadastro de Usuários", path: "/cadastro-admin", adminOnly: true },
    { icon: Book,          label: "Biblioteca Digital", path: "/biblioteca", adminOnly: false },
    { icon: Music,         label: "Audições", path: "/audicoes", adminOnly: false },
    { icon: Calendar,      label: "Ensaios", path: "/ensaios", adminOnly: false },
    { icon: DollarSign,    label: "Financeiro", path: "/financeiro", adminOnly: false },
    { icon: Settings,      label: "Configurações", path: "/configuracoes", active: true, adminOnly: false },
  ];
  const visibleNavigationItems = allNavigationItems.filter(item => !item.adminOnly || userInfo?.tipo === 'Administrador');


  if (loading || !userInfo) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg shrink-0">
        <div className="p-6 border-b"><h2 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => router.push("/home")}>Encenna<br /><small className="text-sm font-normal text-gray-600">Digital</small></h2></div>
        <nav className="p-4"><div className="space-y-2">
            {visibleNavigationItems.map((item) => {
              const IconComponent = item.icon;
              return (<Button key={item.path} variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${item.active ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => router.push(item.path)}>
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
              </Button>)
            })}
        </div></nav>
        <div className="p-4 absolute bottom-0 w-64">
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={userInfo.fotoPerfil || `https://ui-avatars.com/api/?name=${userInfo.nome.replace(" ", "+")}&background=0D8ABC&color=fff`} alt={userInfo.nome} />
              <AvatarFallback>{userInfo.nome.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{userInfo.nome}</h1>
              <p className="text-lg text-gray-500">{userInfo.tipo}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DadosPessoaisForm userInfo={userInfo} />
            <AlterarSenhaForm userId={userInfo.id} />
          </div>
        </div>
      </main>
    </div>
  );
}