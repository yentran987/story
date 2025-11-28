"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function ReaderPage({
  params,
}: {
  params: { id: string; chapterId: string }
}) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) {
      const storyId = Number.parseInt(params.id)
      const progressKey = `storyweave_progress_${storyId}`
      localStorage.setItem(progressKey, params.chapterId)
    }
  }, [params.id, params.chapterId, isLoggedIn])

  return (
    <div className="min-h-screen bg-background">
      {/* Reader Header */}
      <div className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href={`/story/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-lg font-semibold flex-1 text-center">
            <Link href={`/story/${params.id}`} className="hover:text-purple-400 transition">
              The Crimson Labyrinth
            </Link>
            <span className="text-foreground/60 mx-2">/</span>
            Chapter {params.chapterId}: The Whispered Caves
          </h2>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Reader Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <article className="prose prose-invert max-w-none text-foreground/90 leading-relaxed">
          <p>
            The air in the cave was thick and damp, heavy with the scent of wet stone and something else... something
            ancient and unsettling. Elara held her glowing crystal aloft, its cool light pushing back the oppressive
            darkness just enough to reveal the glistening walls of the cavern. Every drip of water echoed like a
            footstep, and the silence between the sounds was a living thing, pressing in on her from all sides.
          </p>

          <p>
            She took a hesitant step forward, her boots crunching softly on the gravelly floor. The whispers started
            then, faint at first, like the rustling of dry leaves, but they grew in intensity with each step she took
            deeper into the earth's belly. They weren't in any language she knew, yet she understood their intent – a
            warning, a lament, a plea.
          </p>

          <p>
            She clutched the hilt of her sword, its familiar weight a small comfort in this place of shadows. The legend
            spoke of a heartstone, a gem that could calm the restless spirits of the mountain, and she was determined to
            find it. The whispers swirled around her, weaving tales of sorrow and betrayal, trying to turn her back. But
            Elara's resolve was as unyielding as the rock surrounding her. She pushed onward, the crystal's light her
            only guide, her heart a steady drum against the symphony of whispers.
          </p>

          <p>
            Further in, the passage widened into a vast chamber. In the center, a pool of impossibly clear water
            reflected the cavern roof, which glittered with thousands of tiny, phosphorescent fungi, mimicking a starlit
            night sky. It was breathtakingly beautiful, a stark contrast to the oppressive feeling that had clung to her
            since she entered. The whispers softened here, almost fading into the gentle lapping of the water. Was this
            the heart of the mountain? Was this where she'd find the heartstone?
          </p>

          <p>
            And then she saw it. Rising from the center of the pool was a stone pedestal, and upon it sat a gem that
            glowed with an inner light, radiating waves of serene blue luminescence. The heartstone. Her mission was
            nearly complete. But as she stepped toward the water's edge, a shadow moved beneath the surface, and the
            water began to ripple. The whispers erupted once more, louder and more desperate than before.
          </p>
        </article>

        {/* Navigation */}
        <div className="flex gap-4 mt-16 pt-8 border-t border-border">
          <Button variant="outline" className="border-border hover:bg-foreground/5 bg-transparent">
            ← Previous
          </Button>
          <div className="flex-1 flex items-center justify-center text-sm text-foreground/60">
            Chapter {params.chapterId} of 20
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Next →</Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-1/4" />
          </div>
        </div>
      </div>
    </div>
  )
}
