"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Usuario {
  _id: string;
  nome: string;
}

interface CriarTurmaFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

interface UserSelectorProps {
  tipo: 'Professor' | 'Aluno';
  onSelect: (user: Usuario) => void;
  placeholder: string;
  selectedValue?: string;
}


function UserSelector({ tipo, onSelect, placeholder, selectedValue }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      const fetchUsers = async () => {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:3001/api/usuario/listarUsuarios?tipo=${tipo}&nome=${query}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
        setIsLoading(false);
      };
      fetchUsers();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, tipo]);


  const handleSelect = (user: Usuario) => {
    onSelect(user);
    setOpen(false);
  };

  const selectedUserName = users.find(u => u._id === selectedValue)?.nome || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <span className="truncate">{selectedUserName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${tipo}...`} onValueChange={setQuery} />
          <CommandList>
            {isLoading && <CommandEmpty>Buscando...</CommandEmpty>}
            {!isLoading && <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>}
            <CommandGroup>
              {users.map((user) => (
                <CommandItem key={user._id} onSelect={() => handleSelect(user)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedValue === user._id ? "opacity-100" : "opacity-0")} />
                  {user.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


export function CriarTurmaForm({ onSuccess, onClose }: CriarTurmaFormProps) {
  const [nomeTurma, setNomeTurma] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [alunos, setAlunos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectAluno = (aluno: Usuario) => {
    if (!alunos.find(a => a._id === aluno._id)) {
      setAlunos([...alunos, aluno]);
    }
  };
  
  const handleRemoveAluno = (alunoId: string) => {
    setAlunos(alunos.filter(a => a._id !== alunoId));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!nomeTurma || !professorId) {
      setError("Nome da turma e Professor são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const body = {
        nomeTurma,
        professorId,
        alunoIds: alunos.map(a => a._id)
      };
      
      const response = await fetch("http://localhost:3001/api/turma/criarTurma", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Falha ao criar turma.");
      
      alert("Turma criada com sucesso!");
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
      <div className="space-y-2">
        <Label htmlFor="nomeTurma">Nome da Turma</Label>
        <Input id="nomeTurma" value={nomeTurma} onChange={(e) => setNomeTurma(e.target.value)} placeholder="Ex: Teatro Avançado - 2025" required />
      </div>

      <div className="space-y-2">
        <Label>Professor</Label>
        <UserSelector tipo="Professor" onSelect={(user: Usuario) => setProfessorId(user._id)} placeholder="Selecione um professor" selectedValue={professorId} />
      </div>

      <div className="space-y-2">
        <Label>Alunos</Label>
        <UserSelector tipo="Aluno" onSelect={handleSelectAluno} placeholder="Buscar e adicionar alunos" />
        <div className="space-y-2 mt-2 p-2 border rounded-md min-h-[50px] max-h-40 overflow-y-auto">
          {alunos.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">Nenhum aluno adicionado.</p>
          ) : (
            alunos.map(aluno => (
              <div key={aluno._id} className="flex justify-between items-center text-sm bg-gray-100 p-2 rounded">
                <span className="truncate">{aluno.nome}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleRemoveAluno(aluno._id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar Turma"}</Button>
      </div>
    </form>
  );
}