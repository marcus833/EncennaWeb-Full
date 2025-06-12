"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, Settings, GraduationCap, Calendar, DollarSign, Music, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminView } from "@/components/gestao-academica/AdminView";
import { ProfessorView } from "@/components/gestao-academica/ProfessorView";
import { AlunoView } from "@/components/gestao-academica/AlunoView";

interface UserInfo {
  id: string;
  nome: string;
  email: string;
  tipo: "Administrador" | "Professor" | "Aluno";
}

export default function GestaoAcademicaPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("userInfo");
    if (userJson) {
      setUserInfo(JSON.parse(userJson));
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const allNavigationItems = [
    { icon: GraduationCap, label: "Gestão Acadêmica", path: "/gestaoacademica", active: true, adminOnly: false },
    { icon: UserPlus,      label: "Cadastro de Usuários", path: "/cadastro-admin", adminOnly: true },
    { icon: Book,          label: "Biblioteca Digital", path: "/biblioteca", adminOnly: false },
    { icon: Music,         label: "Audições", path: "/audicoes", adminOnly: false },
    { icon: Calendar,      label: "Ensaios", path: "/ensaios", adminOnly: false },
    { icon: DollarSign,    label: "Financeiro", path: "/financeiro", adminOnly: false },
    { icon: Settings,      label: "Configurações", path: "/configuracoes", adminOnly: false },
  ];

  const visibleNavigationItems = allNavigationItems.filter(item => {
    if (!item.adminOnly) {
      return true;
    }
    return userInfo?.tipo === 'Administrador';
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    router.push("/");
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center p-10">Carregando...</div>;
    }

    switch (userInfo?.tipo) {
      case "Administrador":
        return <AdminView />;
      case "Professor":
        return <ProfessorView />;
      case "Aluno":
        return <AlunoView />;
      default:
        return <div className="text-center p-10">Verificando permissões...</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg shrink-0 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => router.push("/home")}>
            Encenna<br /><small className="text-sm font-normal text-gray-600">Digital</small>
          </h2>
        </div>
        <nav className="p-4 flex-grow">
          <div className="space-y-2">
            {visibleNavigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.active || false;
              return (
                <Button key={item.path} variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => router.push(item.path)}>
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}><LogOut className="h-4 w-4" /> Logout</Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}