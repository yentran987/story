"use client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import TrendingStoriesSection from "@/components/landing/trending-stories"
import FeaturesSection from "@/components/landing/features-section"
import CTASection from "@/components/landing/cta-section"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-teal-900/20" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Your Next Chapter Awaits</h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto text-balance">
            The ultimate platform for discovering new worlds and sharing your own. Read, write, and connect with a
            global community of storytellers.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <Link href="/browse">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Start Reading
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/write">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-foreground/20 hover:bg-foreground/5 bg-transparent"
              >
                Start Writing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">150K+</div>
              <div className="text-sm text-foreground/60">Stories Published</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">2M+</div>
              <div className="text-sm text-foreground/60">Active Readers</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">50K+</div>
              <div className="text-sm text-foreground/60">Authors Joined</div>
            </div>
          </div>
        </div>
      </section>

      <TrendingStoriesSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
