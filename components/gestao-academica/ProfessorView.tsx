"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Save } from "lucide-react";

interface Aluno {
  _id: string;
  nome: string;
}

interface Matricula {
  _id: string;
  aluno: Aluno | null;
  notaNaTurma: number;
  frequenciaNaTurma: number;
}

interface Turma {
  _id: string;
  nomeTurma: string;
  alunos: Matricula[];
}

export function ProfessorView() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [updates, setUpdates] = useState<{ [matriculaId: string]: { nota?: number; frequencia?: number } }>({});
  const [saving, setSaving] = useState(false);

  const fetchMinhasTurmas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Você não está autenticado.");
      
      const response = await fetch("http://localhost:3001/api/turma/listarTurmas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao buscar suas turmas.");
      
      const data = await response.json();
      setTurmas(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinhasTurmas();
  }, []);

  const handleInputChange = (matriculaId: string, campo: 'nota' | 'frequencia', valor: string) => {
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) && valor !== '') return;

    setUpdates(prev => ({
      ...prev,
      [matriculaId]: {
        ...prev[matriculaId],
        [campo]: isNaN(valorNumerico) ? undefined : valorNumerico
      }
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const token = localStorage.getItem("authToken");
    
    const promises = Object.entries(updates).map(([matriculaId, dados]) =>
      fetch(`http://localhost:3001/api/matricula/atualizar/${matriculaId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(dados)
      })
    );

    try {
      await Promise.all(promises);
      alert("Alterações salvas com sucesso!");
      setUpdates({});
      fetchMinhasTurmas().then(() => {
          setTurmaSelecionada(prev => prev ? turmas.find(t => t._id === prev._id) || null : null);
      });

    } catch (err) {
      alert("Ocorreu um erro ao salvar as alterações.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (turmaSelecionada) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setTurmaSelecionada(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">{turmaSelecionada.nomeTurma}</h2>
          </div>
          <Button onClick={handleSaveChanges} disabled={Object.keys(updates).length === 0 || saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead className="w-[120px]">Nota (0-10)</TableHead>
                <TableHead className="w-[150px]">Frequência (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmaSelecionada.alunos.map(matricula => (
                <TableRow key={matricula._id}>
                  <TableCell className="font-medium">
                    {matricula.aluno ? matricula.aluno.nome : <span className="text-red-500 italic">Aluno Removido</span>}
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={matricula.notaNaTurma} 
                      min="0" max="10" step="0.5"
                      disabled={!matricula.aluno}
                      onChange={(e) => handleInputChange(matricula._id, 'nota', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      defaultValue={matricula.frequenciaNaTurma}
                      min="0" max="100"
                      disabled={!matricula.aluno}
                      onChange={(e) => handleInputChange(matricula._id, 'frequencia', e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Turmas</h2>
      {loading && <p>Carregando turmas...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && turmas.map(turma => (
          <Card key={turma._id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setTurmaSelecionada(turma)}>
            <CardHeader><CardTitle>{turma.nomeTurma}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{turma.alunos.length} aluno(s)</span>
              </div>
            </CardContent>
          </Card>
        ))}
         {!loading && !error && turmas.length === 0 && <p>Você ainda não foi atribuído a nenhuma turma.</p>}
      </div>
    </div>
  );
}