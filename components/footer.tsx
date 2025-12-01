"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              StoryWeave
            </h4>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/explore" className="hover:text-foreground transition">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/write" className="hover:text-foreground transition">
                  Write
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-foreground transition">
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-foreground transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>© 2025 StoryWeave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
