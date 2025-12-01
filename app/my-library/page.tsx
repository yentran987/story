"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"

export default function MyLibraryPage() {
  const { isLoggedIn, user } = useAuth()
  const [tab, setTab] = useState<"my-stories" | "saved-stories">("my-stories")
  const [searchQuery, setSearchQuery] = useState("")
  const [myStories, setMyStories] = useState<any[]>([])
  const [savedStories, setSavedStories] = useState<any[]>([])

  useEffect(() => {
    if (isLoggedIn && user) {
      const allStories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
      const userStories = allStories.filter((s: any) => s.userId === user.id)
      setMyStories(userStories)

      // Load saved stories
      const savedIds = JSON.parse(localStorage.getItem("storyweave_saved_stories") || "[]")
      const saved = savedIds
        .map((id: string) => {
          const story = allStories.find((s: any) => s.id === id)
          return story
        })
        .filter((story: any) => story !== undefined)
      setSavedStories(saved)
    }
  }, [isLoggedIn, user])

  const filteredMyStories = myStories.filter((story) => story.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredSavedStories = savedStories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            {filteredMyStories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">No stories yet.</p>
                <p className="text-foreground/50 text-sm mt-2">Create your first story to get started.</p>
                <Link href="/write">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">+ Create New Story</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {filteredMyStories.map((story) => (
                    <Link key={story.id} href={`/write/${story.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                          <Image
                            src="/generic-placeholder-graphic.png"
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
                        <h3 className="font-semibold group-hover:text-purple-400 transition line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-xs text-foreground/60">{story.genre}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href="/write">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">+ Create New Story</Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Saved Stories Tab */}
        {tab === "saved-stories" && (
          <div>
            {filteredSavedStories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">No saved stories yet.</p>
                <p className="text-foreground/50 text-sm mt-2">Save stories from the Explore page to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredSavedStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                        <Image
                          src="/generic-placeholder-graphic.png"
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold group-hover:text-purple-400 transition line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-xs text-foreground/60">By {story.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
