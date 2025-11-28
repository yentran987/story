"use client"

import Link from "next/link"
import { Plus, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

const draftStories = [
  {
    id: 1,
    title: "Echoes of the Void",
    genre: "Sci-Fi",
    chapters: 5,
    lastEdited: "2 hours ago",
  },
  {
    id: 2,
    title: "The Last Librarian",
    genre: "Adventure",
    chapters: 12,
    lastEdited: "1 day ago",
  },
  {
    id: 3,
    title: "Cybernetic Dreams",
    genre: "Cyberpunk",
    chapters: 8,
    lastEdited: "3 days ago",
  },
]

export default function WritePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Stories
            </h1>
            <p className="text-foreground/70">Craft your narrative, share your voice.</p>
          </div>
          <Link href="/write/new">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Story
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground/80">
            <Folder className="w-5 h-5" />
            In Progress
          </h2>
          {draftStories.map((story) => (
            <Link key={story.id} href={`/write/${story.id}`}>
              <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-border rounded-xl hover:border-purple-300 transition group cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-purple-600 transition mb-2">{story.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <span>{story.genre}</span>
                      <span>•</span>
                      <span>{story.chapters} chapters</span>
                      <span>•</span>
                      <span>Edited {story.lastEdited}</span>
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    Continue Editing
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
