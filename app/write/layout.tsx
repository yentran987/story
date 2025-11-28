"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/sign-in")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}
