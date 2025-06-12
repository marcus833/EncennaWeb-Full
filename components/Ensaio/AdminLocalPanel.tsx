"use client"
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Local { _id: string; nome: string; }

interface AdminLocalPanelProps {
  locais: Local[];
  onUpdate: () => void;
}

export function AdminLocalPanel({ locais, onUpdate }: AdminLocalPanelProps) {
  const [novoLocalNome, setNovoLocalNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCriarLocal = async () => {
    if (!novoLocalNome) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:3001/api/local/criarLocal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: novoLocalNome })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Erro ao criar local.");
      
      alert(`Local "${novoLocalNome}" criado com sucesso!`);
      setNovoLocalNome("");
      onUpdate();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-6 bg-slate-100 rounded-lg shadow-inner">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Painel de Gerenciamento de Locais (Admin)</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div className="space-y-2">
            <Label htmlFor="novo-local">Nome do Novo Local</Label>
            <Input 
              id="novo-local" 
              placeholder="Ex: Palco Principal"
              value={novoLocalNome}
              onChange={(e) => setNovoLocalNome(e.target.value)}
            />
          </div>
          <Button onClick={handleCriarLocal} disabled={loading}>{loading ? "Criando..." : "Criar Local"}</Button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className='space-y-2'>
            <Label>Locais Existentes</Label>
            <div className='p-2 border rounded-md bg-white min-h-[100px] max-h-40 overflow-y-auto'>
                {locais.length > 0 ? (
                    <ul>{locais.map(l => <li key={l._id} className="text-sm p-1">{l.nome}</li>)}</ul>
                ) : (
                    <p className='text-sm text-gray-500'>Nenhum local cadastrado.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}