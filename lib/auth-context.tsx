"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  user: { id: string; username: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (username: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null)

  // Check for stored auth on mount
  useEffect(() => {
    const stored = localStorage.getItem("storyweave_user")
    if (stored) {
      setUser(JSON.parse(stored))
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const userId =
      "user_" +
      btoa(email)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 16)
    const userData = {
      id: userId,
      username: email.split("@")[0],
      email: email,
    }
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("storyweave_user", JSON.stringify(userData))

    if (!localStorage.getItem("storyweave_saved_stories")) {
      localStorage.setItem("storyweave_saved_stories", JSON.stringify([]))
    }
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("storyweave_user")
  }

  const signup = async (username: string, email: string, password: string) => {
    const userId =
      "user_" +
      btoa(email)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 16)
    const userData = {
      id: userId,
      username: username,
      email: email,
    }
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("storyweave_user", JSON.stringify(userData))

    localStorage.setItem("storyweave_saved_stories", JSON.stringify([]))
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
