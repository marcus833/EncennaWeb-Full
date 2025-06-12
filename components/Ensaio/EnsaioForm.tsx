"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X } from "lucide-react";

interface Local { _id: string; nome: string; }
interface Usuario { _id: string; nome: string; }
interface EnsaioFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

function UserSelector({ onSelect }: { onSelect: (user: Usuario) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchUsers = async () => {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:3001/api/usuario/listarUsuarios?nome=${query}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) setUsers(await response.json());
      };
      fetchUsers();
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button type="button" variant="outline" className="w-full justify-start">Buscar e adicionar participante...</Button></PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command>
        <CommandInput placeholder="Buscar por nome..." onValueChange={setQuery} />
        <CommandList><CommandEmpty>Nenhum usuário encontrado.</CommandEmpty><CommandGroup>
          {users.map((user) => (
            <CommandItem key={user._id} onSelect={() => { onSelect(user); setOpen(false); }}>{user.nome}</CommandItem>
          ))}
        </CommandGroup></CommandList>
      </Command></PopoverContent>
    </Popover>
  );
}

export function EnsaioForm({ onSuccess, onClose }: EnsaioFormProps) {
  const [formData, setFormData] = useState({
    pecaRelacionada: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    local: "",
    participantesObservacao: ""
  });
  const [participantes, setParticipantes] = useState<Usuario[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocais = async () => {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/local/listarLocais", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) setLocais(await response.json());
    };
    fetchLocais();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectParticipante = (user: Usuario) => {
    if (!participantes.find(p => p._id === user._id)) {
      setParticipantes([...participantes, user]);
    }
  };

  const handleRemoveParticipante = (id: string) => {
    setParticipantes(participantes.filter(p => p._id !== id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (participantes.length < 5) {
      setError("É necessário no mínimo 5 participantes.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const body = { ...formData, participantes: participantes.map(p => p._id) };
      
      const response = await fetch("http://localhost:3001/api/ensaio/criarEnsaio", {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Falha ao agendar ensaio.");
      
      alert("Ensaio agendado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="pecaRelacionada">Peça Relacionada</Label><Input id="pecaRelacionada" value={formData.pecaRelacionada} onChange={handleChange} required /></div>
        <div className="space-y-2"><Label htmlFor="local">Local</Label>
          <Select onValueChange={(value) => handleSelectChange('local', value)} required><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>{locais.map(l => <SelectItem key={l._id} value={l._id}>{l.nome}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="data">Data</Label><Input id="data" type="date" value={formData.data} onChange={handleChange} required /></div>
        <div className="flex gap-2 items-end">
            <div className="space-y-2 w-full"><Label htmlFor="horarioInicio">Início</Label><Input id="horarioInicio" type="time" value={formData.horarioInicio} onChange={handleChange} required /></div>
            <div className="space-y-2 w-full"><Label htmlFor="horarioFim">Fim</Label><Input id="horarioFim" type="time" value={formData.horarioFim} onChange={handleChange} required /></div>
        </div>
      </div>
      <div className="space-y-2"><Label>Participantes ({participantes.length})</Label>
        <UserSelector onSelect={handleSelectParticipante} />
        <div className="space-y-1 mt-2 p-2 border rounded-md min-h-[60px] max-h-32 overflow-y-auto">
          {participantes.map(p => (
            <div key={p._id} className="flex justify-between items-center text-sm bg-gray-100 p-1 px-2 rounded">
              <span>{p.nome}</span><Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRemoveParticipante(p._id)}><X className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2"><Label htmlFor="participantesObservacao">Observações</Label><Textarea id="participantesObservacao" value={formData.participantesObservacao} onChange={handleChange} /></div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar Ensaio"}</Button>
      </div>
    </form>
  );
}