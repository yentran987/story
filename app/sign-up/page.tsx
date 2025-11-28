"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/auth-context"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    setIsLoading(true)
    try {
      await signup(username, email, password)
      router.push("/browse")
    } catch (error) {
      console.error("Signup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="grid md:grid-cols-2 gap-8 px-4 py-8 max-w-7xl mx-auto">
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full h-96 md:h-full min-h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-lg">
            <Image src="/writing-desk-notebook-pen.jpg" alt="Writing workspace" fill className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center max-w-md">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Start Your Next Chapter
          </h1>
          <p className="text-foreground/70 mb-8">Create an account to read, write, and connect with writers.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                placeholder="Choose a unique username"
                className="bg-secondary/30 border-border"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
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
                placeholder="Create a strong password"
                className="bg-secondary/30 border-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-foreground/60 mt-2">
                Minimum 8 characters, with one number and one uppercase letter.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                className="bg-secondary/30 border-border"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2 my-4">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-foreground/70">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/60">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-border hover:bg-secondary/30 bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="border-border hover:bg-secondary/30 bg-transparent">
              Facebook
            </Button>
          </div>

          <p className="text-center text-sm text-foreground/70 mt-6">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
