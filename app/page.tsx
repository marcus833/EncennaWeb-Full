"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const API_URL = "http://localhost:3001/api/usuario/login"

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao tentar fazer login.")
      }
      
      console.log("Login realizado com sucesso!", data)

      localStorage.setItem("authToken", data.token)
      localStorage.setItem("userInfo", JSON.stringify(data.usuario))

      router.push("/home")

    } catch (err) {
      console.error("Erro no login:", err)
      
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Ocorreu um erro inesperado.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Encenna
                <br />
                <span className="text-xl font-normal text-gray-600">Digital</span>
              </h1>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                className="h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <Input
                type="password"
                placeholder="Digite sua senha"
                className="h-12"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <p className="text-sm text-center text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-4"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex flex-col space-y-2 mt-4">
              <div className="text-center">
                <Link href="/recuperar-senha" className="text-sm text-blue-600 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}