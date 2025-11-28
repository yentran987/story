"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      router.push("/browse")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="grid md:grid-cols-2 gap-8 px-4 py-8 max-w-7xl mx-auto">
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full h-96 md:h-full min-h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl overflow-hidden shadow-lg">
            <Image src="/typewriter-desk-writer.jpg" alt="Typewriter desk" fill className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center max-w-md">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-foreground/70 mb-8">Sign in to continue your creative journey.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Email or Username</label>
              <Input
                type="text"
                placeholder="Enter your email or username"
                className="bg-secondary/30 border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="bg-secondary/30 border-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-block">
                Forgot Password?
              </Link>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/60">OR</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-border hover:bg-secondary/30 bg-transparent">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-foreground/70 mt-6">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
