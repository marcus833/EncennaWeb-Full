// components/configuracoes/AlterarSenhaForm.tsx
"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AlterarSenhaForm({ userId }: { userId: string }) {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) { // Exemplo de validação simples
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true); setError(""); setMessage("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/usuario/atualizarUsuario/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Falha ao alterar senha.");
      
      setMessage("Senha alterada com sucesso!");
      setSenha(""); setConfirmarSenha("");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="senha">Nova Senha</Label><Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label><Input id="confirmarSenha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Alterando..." : "Alterar Senha"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}