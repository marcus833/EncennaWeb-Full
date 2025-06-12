"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdicionarMaterialFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AdicionarMaterialForm({ onSuccess, onClose }: AdicionarMaterialFormProps) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<"Livro" | "Roteiro" | "Partitura" | "Outro" | "">("");
  const [autor, setAutor] = useState("");
  const [arquivo, setArquivo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!titulo || !tipo) {
      setError("Título e Tipo são obrigatórios.");
      setLoading(false);
      return;
    }

    let body: any = { titulo, tipo };
    if (tipo !== "Livro") {
      if (autor) body.autor = autor;
      if (arquivo) body.arquivo = arquivo;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/biblioteca/criarMaterial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro || "Falha ao criar material.");
      
      alert("Material adicionado com sucesso!");
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
        <Label htmlFor="tipo">Tipo</Label>
        <Select onValueChange={(value: any) => setTipo(value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Livro">Livro</SelectItem>
            <SelectItem value="Roteiro">Roteiro</SelectItem>
            <SelectItem value="Partitura">Partitura</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input 
          id="titulo" 
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Hamlet"
          required
        />
      </div>

      {tipo && tipo !== "Livro" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="autor">Autor</Label>
            <Input 
              id="autor" 
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="(Opcional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arquivo">URL do Arquivo</Label>
            <Input 
              id="arquivo" 
              value={arquivo}
              onChange={(e) => setArquivo(e.target.value)}
              placeholder="(Opcional) Link para PDF, etc."
            />
          </div>
        </>
      )}

      {error && <p className="text-center text-sm text-red-600">{error}</p>}
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Material"}
        </Button>
      </div>
    </form>
  );
}