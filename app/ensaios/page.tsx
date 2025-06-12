"use client"

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen, Plus, Clock, X, CheckCircle, XCircle, Book, Settings, GraduationCap, Calendar, DollarSign, Music, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLocalPanel } from "@/components/Ensaio/AdminLocalPanel";

interface Local { _id: string; nome: string; }
interface Ensaio { _id: string; pecaRelacionada: string; horarioInicio: string; horarioFim: string; local: { _id: string }; }
interface UserInfo { id: string; tipo: 'Administrador' | 'Professor' | 'Aluno'; }

function AgendamentoForm({ local, data, horario, onClose, onSuccess }: { local: Local, data: string, horario: string, onClose: () => void, onSuccess: () => void }) {
    const [peca, setPeca] = useState("");
    const [observacao, setObservacao] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError("");
        try {
            const token = localStorage.getItem("authToken");
            const body = {
                pecaRelacionada: peca, data, horarioInicio: horario,
                horarioFim: `${(parseInt(horario.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
                local: local._id, participantesObservacao: observacao,
            };
            const response = await fetch('http://localhost:3001/api/ensaio/criarEnsaio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.erro || "Erro ao agendar.");
            alert("Ensaio agendado com sucesso!"); onSuccess(); onClose();
        } catch (err) { if(err instanceof Error) setError(err.message); } finally { setLoading(false); }
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Agendar em {local.nome}</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">Agendando para <span className="font-bold">{new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span> às <span className="font-bold">{horario}</span>.</p>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2"><Label htmlFor="peca">Peça Relacionada / Motivo</Label><Input id="peca" value={peca} onChange={e => setPeca(e.target.value)} required /></div>
                <div className="space-y-2"><Label htmlFor="obs">Observações (participantes, etc)</Label><Textarea id="obs" value={observacao} onChange={e => setObservacao(e.target.value)} /></div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Agendando...' : 'Confirmar Agendamento'}</Button>
            </form>
        </DialogContent>
    );
}

export default function EnsaiosPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [locais, setLocais] = useState<Local[]>([]);
  const [ensaiosDoDia, setEnsaiosDoDia] = useState<Ensaio[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [horarioSelecionado, setHorarioSelecionado] = useState("14:00");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{local: Local; horario: string} | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Não autenticado");
      const [locaisRes, ensaiosRes] = await Promise.all([
        fetch("http://localhost:3001/api/local/listarLocais", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`http://localhost:3001/api/ensaio/listarEnsaios?data=${dataSelecionada}`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);
      if (locaisRes.ok) setLocais(await locaisRes.json());
      if (ensaiosRes.ok) setEnsaiosDoDia(await ensaiosRes.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    const userJson = localStorage.getItem("userInfo");
    if (userJson) setUserInfo(JSON.parse(userJson));
    fetchData();
  }, [dataSelecionada]);

  const verificarDisponibilidade = (localId: string, horario: string) => {
    for (const ensaio of ensaiosDoDia) {
      if (ensaio.local._id === localId && horario >= ensaio.horarioInicio && horario < ensaio.horarioFim) return false;
    }
    return true;
  };

  const handleCardClick = (local: Local) => {
    const disponivel = verificarDisponibilidade(local._id, horarioSelecionado);
    if (disponivel) {
      setModalData({ local, horario: horarioSelecionado });
      setModalOpen(true);
    } else {
      alert("Este horário já está ocupado para este local.");
    }
  };

  const allNavigationItems = [
    { icon: GraduationCap, label: "Gestão Acadêmica", path: "/gestaoacademica", adminOnly: false },
    { icon: UserPlus,      label: "Cadastro de Usuários", path: "/cadastro-admin", adminOnly: true },
    { icon: Book,          label: "Biblioteca Digital", path: "/biblioteca", adminOnly: false },
    { icon: Music,         label: "Audições", path: "/audicoes", adminOnly: false },
    { icon: Calendar,      label: "Ensaios", path: "/ensaios", active: true, adminOnly: false },
    { icon: DollarSign,    label: "Financeiro", path: "/financeiro", adminOnly: false },
    { icon: Settings,      label: "Configurações", path: "/configuracoes", adminOnly: false },
  ];

  const visibleNavigationItems = allNavigationItems.filter(item => 
    !item.adminOnly || userInfo?.tipo === 'Administrador'
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg shrink-0">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => router.push("/home")}>
            Encenna<br /><small className="text-sm font-normal text-gray-600">Digital</small>
          </h2>
        </div>
        <nav className="p-4">
          <div className="space-y-2">
            {visibleNavigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button key={item.path} variant={item.active ? "default" : "ghost"}
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agendamento de Ensaios</h1>
          <p className="text-gray-600 mb-8">Selecione uma data e um horário para ver a disponibilidade dos locais.</p>
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm mb-8">
            <div className="space-y-2 flex-1 min-w-[200px]"><Label htmlFor="data">Data do Ensaio</Label><Input id="data" type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)} /></div>
            <div className="space-y-2 flex-1 min-w-[200px]"><Label htmlFor="horario">Horário Desejado</Label><Input id="horario" type="time" value={horarioSelecionado} onChange={e => setHorarioSelecionado(e.target.value)} step="3600" /></div>
          </div>
          {loading ? <p className='text-center'>Carregando...</p> : (
            locais.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locais.map(local => {
                  const isAvailable = verificarDisponibilidade(local._id, horarioSelecionado);
                  return (
                    <Card key={local._id} onClick={() => handleCardClick(local)} className={`cursor-pointer transition-all ${isAvailable ? 'hover:shadow-lg hover:border-green-500' : 'opacity-60 bg-gray-100'}`}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-medium">{local.nome}</CardTitle>
                        {isAvailable ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>{isAvailable ? "Disponível" : "Ocupado"}</div>
                        <p className="text-xs text-gray-500">{isAvailable ? "Clique para agendar" : "Tente outro horário"}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="text-center p-8 border-dashed"><CardTitle>Nenhum local cadastrado</CardTitle><CardContent className="mt-2">
                  <p>{userInfo?.tipo === 'Administrador' ? 'Use o painel abaixo para adicionar locais.' : 'Peça para um administrador cadastrar os locais.'}</p>
              </CardContent></Card>
            )
          )}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            {modalData && <AgendamentoForm local={modalData.local} data={dataSelecionada} horario={modalData.horario} onClose={() => setModalOpen(false)} onSuccess={fetchData} />}
          </Dialog>
          {userInfo?.tipo === 'Administrador' && (
            <AdminLocalPanel locais={locais} onUpdate={fetchData} />
          )}
        </div>
      </main>
    </div>
  )
}