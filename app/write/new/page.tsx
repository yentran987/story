"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"

export default function NewStoryPage() {
  const router = useRouter()
  const [storyData, setStoryData] = useState({
    title: "",
    genre: "Fantasy",
    synopsis: "",
  })

  const handleCreateStory = () => {
    if (!storyData.title.trim()) {
      alert("Please enter a story title")
      return
    }

    const newStory = {
      id: "story_" + Date.now(),
      title: storyData.title,
      genre: storyData.genre,
      synopsis: storyData.synopsis,
      createdAt: new Date().toISOString(),
      chapters: [],
    }

    // Save to localStorage
    const stories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    stories.push(newStory)
    localStorage.setItem("storyweave_user_stories", JSON.stringify(stories))

    // Navigate to the editor
    router.push(`/write/${newStory.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Create a New Story</h1>
        <p className="text-foreground/70 mb-8">Start your creative journey here</p>

        <div className="bg-card/30 border border-border rounded-lg p-8 space-y-6">
          {/* Story Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Story Title</label>
            <Input
              placeholder="Enter your story title"
              value={storyData.title}
              onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
              className="bg-card/50 border-border text-lg py-3"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={storyData.genre}
              onChange={(e) => setStoryData({ ...storyData, genre: e.target.value })}
              className="w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground"
            >
              <option>Fantasy</option>
              <option>Sci-Fi</option>
              <option>Romance</option>
              <option>Mystery</option>
              <option>Adventure</option>
              <option>Horror</option>
              <option>Thriller</option>
              <option>Historical Fiction</option>
            </select>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium mb-2">Synopsis</label>
            <textarea
              placeholder="Write a brief summary of your story..."
              value={storyData.synopsis}
              onChange={(e) => setStoryData({ ...storyData, synopsis: e.target.value })}
              className="w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground min-h-32 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Link href="/write">
              <Button variant="outline" className="border-border hover:bg-foreground/5 bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleCreateStory} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Create Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
