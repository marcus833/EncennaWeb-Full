"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface UserInfo {
  id: string; nome: string; email: string; telefone: string; cpf: string;
}

export function DadosPessoaisForm({ userInfo }: { userInfo: UserInfo }) {
  const [formData, setFormData] = useState({
    nome: userInfo.nome,
    telefone: userInfo.telefone,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/usuario/atualizarUsuario/${userInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Falha ao atualizar dados.");
      
      const updatedUserInfo = { ...userInfo, nome: data.nome, telefone: data.telefone };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      setMessage("Dados atualizados com sucesso!");
    } catch (err) {
      if (err instanceof Error) setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Dados</CardTitle>
        <CardDescription>Atualize suas informações pessoais aqui.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={formData.nome} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="telefone">Telefone</Label><Input id="telefone" type="tel" value={formData.telefone} onChange={handleChange} /></div>
          <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" value={userInfo.email} disabled /></div>
          <div className="space-y-2"><Label htmlFor="cpf">CPF</Label><Input id="cpf" value={userInfo.cpf} disabled /></div>
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar Dados"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}