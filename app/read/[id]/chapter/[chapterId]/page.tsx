"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

const chapters = [
  {
    id: 1,
    title: "The Forgotten Map",
    subtitle: "In the city powered by forgotten magic, a discovery changes everything",
  },
  {
    id: 2,
    title: "Whispers in the Alleys",
    subtitle: "The whispers grow louder, drawing our hero deeper into the conspiracy",
  },
  {
    id: 3,
    title: "The Sunken District",
    subtitle: "A journey through the city's dark underbelly reveals ancient secrets",
  },
  { id: 4, title: "The Guild of Shadows", subtitle: "Allies and enemies blur as the mystery deepens" },
  { id: 5, title: "Echoes of the Past", subtitle: "The cartographer finds answers hidden in plain sight" },
  { id: 6, title: "The Cartographer's Burden", subtitle: "Every truth comes with a price" },
  { id: 7, title: "A Dangerous Alliance", subtitle: "Strange bedfellows form to change the city's fate" },
  { id: 8, title: "The Labyrinth's First Trial", subtitle: "The real journey begins" },
  { id: 9, title: "Secrets in Stone", subtitle: "Ancient magic awakens" },
  { id: 10, title: "The Guardian's Riddle", subtitle: "A test of wit and courage" },
  { id: 11, title: "Heart of the Maze", subtitle: "The truth awaits at the center" },
  { id: 12, title: "The Crimson Secret", subtitle: "Everything changes" },
]

export default function ReaderPage({
  params,
}: {
  params: { id: string; chapterId: string }
}) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const currentChapterId = Number.parseInt(params.chapterId)
  const totalChapters = chapters.length
  const [canGoBack, setCanGoBack] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [fontSize, setFontSize] = useState("base")
  const [theme, setTheme] = useState("light")
  const [lineHeight, setLineHeight] = useState("relaxed")

  useEffect(() => {
    if (isLoggedIn) {
      const storyId = Number.parseInt(params.id)
      const progressKey = `storyweave_progress_${storyId}`
      localStorage.setItem(progressKey, params.chapterId)
    }
    setCanGoBack(window.history.length > 2)

    const saved = localStorage.getItem("storyweave_reader_prefs")
    if (saved) {
      const prefs = JSON.parse(saved)
      setFontSize(prefs.fontSize || "base")
      setTheme(prefs.theme || "light")
      setLineHeight(prefs.lineHeight || "relaxed")
    }
  }, [params.id, params.chapterId, isLoggedIn])

  const savePreferences = (size?: string, t?: string, lh?: string) => {
    const prefs = {
      fontSize: size || fontSize,
      theme: t || theme,
      lineHeight: lh || lineHeight,
    }
    localStorage.setItem("storyweave_reader_prefs", JSON.stringify(prefs))
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    savePreferences(size, theme, lineHeight)
  }

  const handleThemeChange = (t: string) => {
    setTheme(t)
    savePreferences(fontSize, t, lineHeight)
  }

  const handleLineHeightChange = (lh: string) => {
    setLineHeight(lh)
    savePreferences(fontSize, theme, lh)
  }

  const handlePrevious = () => {
    if (currentChapterId > 1) {
      router.push(`/read/${params.id}/chapter/${currentChapterId - 1}`)
    }
  }

  const handleNext = () => {
    if (currentChapterId < totalChapters) {
      router.push(`/read/${params.id}/chapter/${currentChapterId + 1}`)
    }
  }

  const handleBackClick = () => {
    router.push(`/story/${params.id}`)
  }

  const fontSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const themeClasses = {
    light: "bg-background text-foreground",
    sepia: "bg-amber-50 text-amber-900",
    dark: "bg-slate-900 text-slate-100",
  }

  const lineHeightClasses = {
    normal: "leading-normal",
    relaxed: "leading-relaxed",
    loose: "leading-8",
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme as keyof typeof themeClasses]}`}>
      {/* Reader Header */}
      <div className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold flex-1 text-center">
            <Link href={`/story/${params.id}`} className="hover:text-purple-400 transition">
              The Crimson Labyrinth
            </Link>
            <span className="text-foreground/60 mx-2">/</span>
            Chapter {currentChapterId}: {chapters[currentChapterId - 1]?.title || "The Whispered Caves"}
          </h2>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(!settingsOpen)}>
              <Settings className="w-5 h-5" />
            </Button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-4 space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">Font Size</label>
                  <div className="flex gap-2">
                    {["sm", "base", "lg", "xl"].map((size) => (
                      <Button
                        key={size}
                        variant={fontSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFontSizeChange(size)}
                        className="flex-1"
                      >
                        {size.charAt(0).toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Theme</label>
                  <div className="space-y-1">
                    {["light", "sepia", "dark"].map((t) => (
                      <Button
                        key={t}
                        variant={theme === t ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleThemeChange(t)}
                        className="w-full justify-start"
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Line Height</label>
                  <div className="space-y-1">
                    {["normal", "relaxed", "loose"].map((lh) => (
                      <Button
                        key={lh}
                        variant={lineHeight === lh ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLineHeightChange(lh)}
                        className="w-full justify-start"
                      >
                        {lh.charAt(0).toUpperCase() + lh.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <article
          className={`prose max-w-none ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]} ${lineHeightClasses[lineHeight as keyof typeof lineHeightClasses]}`}
        >
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
          <Button
            onClick={handlePrevious}
            disabled={currentChapterId === 1}
            variant="outline"
            className="border-border hover:bg-foreground/5 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </Button>
          <div className="flex-1 flex items-center justify-center text-sm text-foreground/60">
            Chapter {currentChapterId} of {totalChapters}
          </div>
          <Button
            onClick={handleNext}
            disabled={currentChapterId === totalChapters}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
              style={{ width: `${(currentChapterId / totalChapters) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
