"use client"

import { BookOpen, Users, Zap } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Powerful Editor",
    description:
      "A clean, distraction-free writing environment with rich formatting and version history to help you focus on what matters: your story.",
  },
  {
    icon: Users,
    title: "Engaged Community",
    description:
      "Connect with readers and fellow writers. Get valuable feedback, join discussions, and find your audience in a supportive space.",
  },
  {
    icon: Zap,
    title: "Monetize Your Work",
    description:
      "Turn your passion into profit. We offer flexible ways to earn from your stories, from paid access to reader tips and royalties.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why You'll Love StoryWeave</h2>
          <p className="text-foreground/70 text-lg">
            Discover the tools and community designed to elevate your storytelling
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-8 hover:border-purple-500/50 transition"
              >
                <div className="mb-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
