"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Instruções de recuperação enviadas para: ${email}`)
    setMensagem(`Se o e-mail ${email} estiver cadastrado, você receberá instruções para redefinir sua senha.`)
    setEmail("")
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

          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Atualizar senha</h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enviaremos um e-mail com instruções de como redefinir sua senha.
            </p>

            {mensagem && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm text-center mb-4">
                {mensagem}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                    disabled={!!mensagem}
                  />
                </div>
              </div>

              {!mensagem && (
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                  Enviar Link de Recuperação
                </Button>
              )}

              <div className="text-center mt-4">
                <Link href="/" className="text-sm text-blue-600 hover:underline">
                  Voltar ao login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
