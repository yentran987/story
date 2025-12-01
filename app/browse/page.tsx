"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Settings, LayoutGrid, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"

const genres = ["Fantasy", "Sci-Fi", "Romance", "Mystery", "Adventure"]
const tags = ["Magic", "Adventure", "Ancient Artifact", "Space", "Exploration", "Steampunk", "Pirates"]

export default function BrowsePage() {
  const [allStories, setAllStories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(true)
  const [displayedCount, setDisplayedCount] = useState(3)

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const publishedStories = savedStories.filter((s: any) => s.status === "published")
    setAllStories(publishedStories)
  }, [])

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      const matchesSearch =
        searchQuery === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.hashtags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(story.genre)

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => story.hashtags.includes(tag))

      return matchesSearch && matchesGenre && matchesTags
    })
  }, [searchQuery, selectedGenres, selectedTags, allStories])

  const displayedStories = filteredStories.slice(0, displayedCount)

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedGenres([])
    setSelectedTags([])
    setDisplayedCount(3)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Explore Stories</h1>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search for stories, authors, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? "block" : "hidden"} md:block space-y-6`}>
            <div>
              <h3 className="font-bold mb-4 text-lg">Filters</h3>
              {(selectedGenres.length > 0 || selectedTags.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-purple-400 hover:text-purple-300 text-sm mb-4 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear filters
                </button>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Genre</h4>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={selectedGenres.includes(genre)} onCheckedChange={() => toggleGenre(genre)} />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Tags</h4>
              <div className="space-y-2 mt-3">
                {tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                    <span className="text-sm">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="md:col-span-3">
            {displayedStories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">No stories found matching your filters.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <div className="group cursor-pointer h-full">
                      <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                        <Image
                          src="/generic-placeholder-graphic.png"
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-purple-400 transition line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-xs text-foreground/60 mb-2">By {story.author}</p>
                      <p className="text-xs text-foreground/70 line-clamp-3 mb-3">{story.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {story.hashtags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <div className="flex gap-4 p-4 bg-card/30 border border-border rounded-lg hover:border-purple-500/50 transition group cursor-pointer">
                      <div className="relative w-24 h-32 bg-card rounded overflow-hidden flex-shrink-0">
                        <Image
                          src="/generic-placeholder-graphic.png"
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-purple-400 transition">{story.title}</h3>
                        <p className="text-sm text-foreground/60 mb-2">By {story.author}</p>
                        <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{story.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {story.hashtags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {displayedCount < filteredStories.length && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => setDisplayedCount((prev) => Math.min(prev + 3, filteredStories.length))}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
