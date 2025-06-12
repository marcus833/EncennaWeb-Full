"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Percent } from "lucide-react";

interface Turma {
  _id: string;
  nomeTurma: string;
  professor: { nome: string };
  alunos: { notaNaTurma: number; frequenciaNaTurma: number }[];
}

export function AlunoView() {
  const [minhasTurmas, setMinhasTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Você não está autenticado.");
        
        const response = await fetch("http://localhost:3001/api/turma/listarTurmas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || "Falha ao buscar seus dados acadêmicos.");
        }
        
        const data = await response.json();
        setMinhasTurmas(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Minha Situação Acadêmica</h2>
      {loading && <p className="text-center">Carregando seus dados...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      
      <div className="space-y-6">
        {!loading && !error && minhasTurmas.map(turma => (
          <Card key={turma._id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">{turma.nomeTurma}</CardTitle>
              <CardDescription>Professor(a): {turma.professor.nome}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
                    <GraduationCap className="h-4 w-4" />
                    <span>Sua Nota Final</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mt-2">
                    {turma.alunos[0]?.notaNaTurma ?? 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium">
                    <Percent className="h-4 w-4" />
                    <span>Sua Frequência</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mt-2">
                    {turma.alunos[0]?.frequenciaNaTurma ?? 'N/A'}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && !error && minhasTurmas.length === 0 && (
            <p className="text-center text-gray-500 py-10">Você ainda não está matriculado em nenhuma turma.</p>
        )}
      </div>
    </div>
  );
}