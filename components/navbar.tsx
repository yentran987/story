"use client"

import Link from "next/link"
import { Zap, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span>StoryWeave</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-foreground/70 hover:text-foreground transition">
            Explore Stories
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/write" className="text-foreground/70 hover:text-foreground transition">
                Write
              </Link>
              <Link href="/my-library" className="text-foreground/70 hover:text-foreground transition">
                My Library
              </Link>
            </>
          )}
          <Link href="/community" className="text-foreground/70 hover:text-foreground transition">
            Community
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" className="text-sm">
                  {user.username}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/98 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Explore Stories
              </Button>
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/write" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Write
                  </Button>
                </Link>
                <Link href="/my-library" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    My Library
                  </Button>
                </Link>
              </>
            )}
            <Link href="/community" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Community
              </Button>
            </Link>
            <div className="pt-3 border-t border-border/40 space-y-2">
              {isLoggedIn && user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      {user.username}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start flex items-center gap-2 bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
