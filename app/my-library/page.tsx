"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"

const userStories = [
  {
    id: 1,
    title: "Echoes of the Void",
    genre: "Sci-Fi",
    status: "draft",
    cover: "/scifi-spiral.jpg",
  },
  {
    id: 2,
    title: "The Last Librarian",
    genre: "Adventure",
    status: "published",
    cover: "/library-adventure.jpg",
  },
  {
    id: 3,
    title: "Cybernetic Dreams",
    genre: "Cyberpunk",
    status: "published",
    cover: "/cyberpunk-neon.jpg",
  },
]

const savedStories = [
  {
    id: 101,
    title: "The Crimson Cipher",
    author: "Amelia Reed",
    cover: "/fantasy-crimson.jpg",
  },
  {
    id: 102,
    title: "The Serpent's Heir",
    author: "Tom Ashford",
    cover: "/placeholder.svg?height=300&width=220",
  },
  {
    id: 103,
    title: "A Crown of Iron & Mist",
    author: "Annabel Lin",
    cover: "/placeholder.svg?height=300&width=220",
  },
]

export default function MyLibraryPage() {
  const [tab, setTab] = useState<"my-stories" | "saved-stories">("my-stories")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Library</h1>
        <p className="text-foreground/70 mb-8">Manage your authored and saved stories.</p>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-border">
          <button
            onClick={() => setTab("my-stories")}
            className={`pb-4 font-semibold transition ${
              tab === "my-stories"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            My Stories
          </button>
          <button
            onClick={() => setTab("saved-stories")}
            className={`pb-4 font-semibold transition ${
              tab === "saved-stories"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Saved Stories
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <Input
            placeholder={tab === "my-stories" ? "Search my stories..." : "Search saved stories..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border"
          />
        </div>

        {/* My Stories Tab */}
        {tab === "my-stories" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {userStories.map((story) => (
                <Link key={story.id} href={`/write/${story.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                      <Image
                        src={story.cover || "/placeholder.svg"}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Edit
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            story.status === "published"
                              ? "bg-green-900/70 text-green-300"
                              : "bg-yellow-900/70 text-yellow-300"
                          }`}
                        >
                          {story.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold group-hover:text-purple-400 transition line-clamp-2">{story.title}</h3>
                    <p className="text-xs text-foreground/60">{story.genre}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/write">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">+ Create New Story</Button>
            </Link>
          </div>
        )}

        {/* Saved Stories Tab */}
        {tab === "saved-stories" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedStories.map((story) => (
              <Link key={story.id} href={`/story/${story.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                    <Image
                      src={story.cover || "/placeholder.svg"}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold group-hover:text-purple-400 transition line-clamp-2">{story.title}</h3>
                  <p className="text-xs text-foreground/60">By {story.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
