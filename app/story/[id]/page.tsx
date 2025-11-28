"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Bookmark, Share2, Play, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
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

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      const savedList = JSON.parse(localStorage.getItem("storyweave_saved_stories") || "[]")
      setIsSaved(savedList.includes(Number.parseInt(params.id)))
    }
  }, [isLoggedIn, params.id])

  const handleSaveToLibrary = () => {
    if (!isLoggedIn) {
      router.push("/sign-in")
      return
    }

    const savedList = JSON.parse(localStorage.getItem("storyweave_saved_stories") || "[]")
    const storyId = Number.parseInt(params.id)

    if (isSaved) {
      const updated = savedList.filter((id: number) => id !== storyId)
      localStorage.setItem("storyweave_saved_stories", JSON.stringify(updated))
      setIsSaved(false)
    } else {
      savedList.push(storyId)
      localStorage.setItem("storyweave_saved_stories", JSON.stringify(savedList))
      setIsSaved(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Stories
        </button>

        {/* Story Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Cover Image */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-card rounded-lg overflow-hidden border border-border">
              <Image src="/fantasy-labyrinth-book-cover.jpg" alt="Story cover" fill className="object-cover" />
            </div>
          </div>

          {/* Story Info */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold mb-2">The Crimson Labyrinth</h1>
            <p className="text-foreground/70 text-lg mb-6">By Elara Vance</p>

            {/* Genre Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">Fantasy</span>
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">Adventure</span>
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm">Ongoing</span>
            </div>

            {/* Description */}
            <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
              In a city powered by forgotten magic, a disgraced cartographer discovers a map that leads to a mythical
              labyrinth, said to hold the city's darkest secrets. She must navigate its treacherous paths before a
              shadowy guild exploits its power for their own nefarious ends.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <Link href={`/read/${params.id}/chapter/1`}>
                <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Reading
                </Button>
              </Link>
              <Button
                onClick={handleSaveToLibrary}
                variant="outline"
                className={`border-border hover:bg-foreground/5 py-6 flex items-center justify-center gap-2 bg-transparent transition ${
                  isSaved ? "text-purple-400 border-purple-400" : ""
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save to Library"}
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-foreground/5 py-6 flex items-center justify-center gap-2 bg-transparent"
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-purple-400">4.8</p>
                <p className="text-sm text-foreground/60">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">2.3K</p>
                <p className="text-sm text-foreground/60">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">45K</p>
                <p className="text-sm text-foreground/60">Reads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Chapters ({chapters.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {chapters.map((chapter, idx) => (
              <Link key={chapter.id} href={`/read/${params.id}/chapter/${chapter.id}`}>
                <div
                  className={`p-4 rounded-lg border transition cursor-pointer group ${
                    idx === 2
                      ? "border-purple-500 bg-purple-900/20"
                      : "border-border hover:border-purple-500/50 hover:bg-card/50"
                  }`}
                >
                  <p className="font-semibold text-sm group-hover:text-purple-400 transition">Chapter {chapter.id}</p>
                  <p className="text-sm text-foreground/70 truncate mt-1">{chapter.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
