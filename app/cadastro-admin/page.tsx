"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, CreditCard, Book, Settings, GraduationCap, Calendar, DollarSign, Music, UserPlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UserInfo {
  tipo: "Administrador" | "Professor" | "Aluno";
}

export default function CadastroAdminPage() {
  const router = useRouter();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const userJson = localStorage.getItem("userInfo");
    if (userJson) {
      const user: UserInfo = JSON.parse(userJson);
      if (user.tipo === "Administrador") {
        setIsAuthorized(true);
      } else {
        router.push("/home");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!tipo) {
      setError("Por favor, selecione um tipo de usuário.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/usuario/criarUsuario", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, senha, telefone, cpf, tipo })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || "Falha ao criar usuário.");
      }

      alert("Usuário criado com sucesso!");
      router.push("/gestaoacademica");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao realizar o cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const allNavigationItems = [
    { icon: GraduationCap, label: "Gestão Acadêmica", path: "/gestaoacademica", adminOnly: false },
    { icon: UserPlus, label: "Cadastro de Usuários", path: "/cadastro-admin", active: true, adminOnly: true },
  ];

  const visibleNavigationItems = allNavigationItems.filter(item => 
    !item.adminOnly || (localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo")!).tipo === 'Administrador')
  );

  if (!isAuthorized) {
    return <div className="flex h-screen items-center justify-center">Verificando permissões...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg shrink-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => router.push("/home")}>
              Encenna<br /><small className="text-sm font-normal text-gray-600">Digital</small>
          </h2>
        </div>
        <nav className="p-4">
          {visibleNavigationItems.map((item) => (
            <Button key={item.path} variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 mb-2 ${item.active ? "bg-blue-600 text-white" : ""}`}
              onClick={() => router.push(item.path)}>
              <item.icon className="h-5 w-5" /> {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleCadastro}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Novo Usuário</h2>
              {error && <p className="text-center text-red-600 text-sm mb-4">{error}</p>}
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nome completo</Label><div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><Input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} className="pl-10 h-12" required/></div></div>
                <div className="space-y-2"><Label>E-mail</Label><div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required/></div></div>
                <div className="space-y-2"><Label>Senha</Label><div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><Input type="password" placeholder="Senha provisória" value={senha} onChange={(e) => setSenha(e.target.value)} className="pl-10 h-12" required/></div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Telefone</Label><div className="relative"><Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><Input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="pl-10 h-12" required/></div></div>
                  <div className="space-y-2"><Label>CPF</Label><div className="relative"><CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><Input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} className="pl-10 h-12" required/></div></div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <Select onValueChange={(value) => setTipo(value)} required>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aluno">Aluno</SelectItem>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-6" disabled={loading}>
                  {loading ? "Criando..." : "Criar Usuário"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}