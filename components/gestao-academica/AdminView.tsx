"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, User, Users, Trash2 } from "lucide-react";
import { CriarTurmaForm } from "./CriarTurmaForm";

interface Turma {
  _id: string;
  nomeTurma: string;
  professor: { nome: string };
  alunos: any[];
}

export function AdminView() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTurmas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Usuário não autenticado.");
      
      const response = await fetch("http://localhost:3001/api/turma/listarTurmas", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Falha ao buscar as turmas.");

      const data = await response.json();
      setTurmas(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Painel do Administrador</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><PlusCircle className="h-5 w-5" /> Criar Nova Turma</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader><DialogTitle>Criar Nova Turma</DialogTitle></DialogHeader>
            <CriarTurmaForm onSuccess={fetchTurmas} onClose={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p>Carregando turmas...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && turmas.map(turma => (
          <Card key={turma._id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {turma.nomeTurma}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Professor: {turma.professor.nome}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{turma.alunos.length} aluno(s) matriculado(s)</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}