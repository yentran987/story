"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Folder, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"

export default function WritePage() {
  const { user } = useAuth()
  const [stories, setStories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [storyData, setStoryData] = useState({
    title: "",
    genre: "Fantasy",
    status: "draft",
    hashtags: "",
    description: "",
    author: user?.username || "Anonymous",
  })

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const userStories = savedStories.filter((s: any) => s.userId === user?.id)
    setStories(userStories)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => {
    setStoryData((prev) => ({
      ...prev,
      author: user?.username || "Anonymous",
    }))
  }, [user?.username])

  const handleDeleteStory = (storyId: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      const filtered = stories.filter((s) => s.id !== storyId)
      setStories(filtered)

      const allStories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
      const updatedAll = allStories.filter((s: any) => s.id !== storyId)
      localStorage.setItem("storyweave_user_stories", JSON.stringify(updatedAll))
    }
  }

  const handleCreateStory = () => {
    if (!storyData.title.trim()) {
      alert("Please enter a story title")
      return
    }

    const newStory = {
      id: "story_" + Date.now(),
      title: storyData.title,
      genre: storyData.genre,
      status: storyData.status,
      hashtags: storyData.hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: storyData.description,
      author: storyData.author || user?.username || "Anonymous",
      userId: user?.id,
      createdAt: new Date().toISOString(),
      chapters: [],
    }

    const allStories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const updatedAll = [...allStories, newStory]
    localStorage.setItem("storyweave_user_stories", JSON.stringify(updatedAll))

    const updatedStories = [...stories, newStory]
    setStories(updatedStories)

    // Reset form and close modal
    setStoryData({
      title: "",
      genre: "Fantasy",
      status: "draft",
      hashtags: "",
      description: "",
      author: user?.username || "Anonymous",
    })
    setShowModal(false)

    window.location.href = `/write/${newStory.id}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Your Stories
            </h1>
            <p className="text-foreground/70">Craft your narrative, share your voice.</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Story
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading your stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Folder className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60 mb-4">No stories yet. Create your first story!</p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Create New Story
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground/80">
              <Folder className="w-5 h-5" />
              In Progress
            </h2>
            {stories.map((story) => (
              <div
                key={story.id}
                className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-border rounded-xl hover:border-purple-300 transition group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/write/${story.id}`}>
                      <h3 className="text-lg font-semibold group-hover:text-purple-600 transition mb-2 truncate cursor-pointer">
                        {story.title}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                      <span>{story.genre}</span>
                      <span>•</span>
                      <span>{story.chapters?.length || 0} chapters</span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link href={`/write/${story.id}`} className="flex-1 md:flex-none">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Continue
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border bg-transparent hover:bg-red-500/10"
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
              <h2 className="text-2xl font-bold">Create New Story</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-foreground/10 rounded transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Story Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Story Title *</label>
                <Input
                  placeholder="Enter your story title"
                  value={storyData.title}
                  onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
                  className="bg-card/50 border-border"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  placeholder="Author name"
                  value={storyData.author}
                  onChange={(e) => setStoryData({ ...storyData, author: e.target.value })}
                  className="bg-card/50 border-border"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  value={storyData.genre}
                  onChange={(e) => setStoryData({ ...storyData, genre: e.target.value })}
                  className="w-full px-4 py-2 bg-card/50 border border-border rounded-lg text-foreground"
                >
                  <option>Fantasy</option>
                  <option>Sci-Fi</option>
                  <option>Romance</option>
                  <option>Mystery</option>
                  <option>Adventure</option>
                  <option>Horror</option>
                  <option>Thriller</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={storyData.status}
                  onChange={(e) => setStoryData({ ...storyData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-card/50 border border-border rounded-lg text-foreground"
                >
                  <option value="draft">Draft</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium mb-2">Hashtags</label>
                <Input
                  placeholder="magic, adventure, fantasy (comma-separated)"
                  value={storyData.hashtags}
                  onChange={(e) => setStoryData({ ...storyData, hashtags: e.target.value })}
                  className="bg-card/50 border-border"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Write a brief summary of your story..."
                  value={storyData.description}
                  onChange={(e) => setStoryData({ ...storyData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-card/50 border border-border rounded-lg text-foreground min-h-24 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-border bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateStory}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Create Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
