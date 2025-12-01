"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-900/30 to-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-foreground/70 text-lg mb-8">
          Join thousands of readers and writers on the ultimate storytelling platform. Your adventure begins here.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
            Join for Free
          </Button>
        </Link>
      </div>
    </section>
  )
}
