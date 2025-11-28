"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Settings, LayoutGrid, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "@/components/navbar"

const genres = ["Fantasy", "Sci-Fi", "Romance", "Mystery", "Adventure"]
const tags = ["Magic", "Adventure", "Ancient Artifact", "Space", "Exploration", "Steampunk", "Pirates"]

const allStories = [
  {
    id: 1,
    title: "The Crimson Prophecy",
    author: "Elara Vance",
    genre: "Fantasy",
    tags: ["Fantasy", "Magic", "Adventure"],
    description:
      "A forgotten prophecy resurfaces, binding a reluctant sorceress to a quest that could save her kingdom or shatter it into oblivion.",
    cover: "/fantasy-crimson.jpg",
  },
  {
    id: 2,
    title: "Echoes of Nebula",
    author: "Jax Orion",
    genre: "Sci-Fi",
    tags: ["Sci-Fi", "Space", "Exploration"],
    description:
      "In a distant galaxy, a lone pilot discovers an ancient signal that holds the key to humanity's survival.",
    cover: "/scifi-nebula.jpg",
  },
  {
    id: 3,
    title: "The Last Bookseller",
    author: "Amelia Blackwood",
    genre: "Mystery",
    tags: ["Mystery", "Thriller"],
    description:
      "When a reclusive bookseller finds a hidden message in a centuries-old tome, she's drawn into a city-wide conspiracy.",
    cover: "/mystery-books.jpg",
  },
  {
    id: 4,
    title: "Beneath the Willow",
    author: "Leo Ashworth",
    genre: "Romance",
    tags: ["Romance", "Contemporary"],
    description:
      "A summer romance blossoms between two artists from different worlds, but secrets threaten to tear them apart before the leaves fall.",
    cover: "/romance-willow.jpg",
  },
  {
    id: 5,
    title: "City of Gears",
    author: "Victor Cogsworth",
    genre: "Adventure",
    tags: ["Steampunk", "Adventure"],
    description: "An inventor in a steampunk metropolis uncovers a plot to overthrow the city's automated government.",
    cover: "/placeholder.svg",
  },
  {
    id: 6,
    title: "The Sunken Crown",
    author: "Marina Tide",
    genre: "Adventure",
    tags: ["Fantasy", "Pirates"],
    description:
      "A determined pirate captain seeks a legendary crown said to control the seas, battling rival crews and mythical sea creatures.",
    cover: "/placeholder.svg",
  },
  {
    id: 7,
    title: "Whispers in the Void",
    author: "Dr. Nova Stone",
    genre: "Sci-Fi",
    tags: ["Sci-Fi", "Space", "Exploration"],
    description: "A deep space explorer receives mysterious signals from an unknown civilization beyond charted space.",
    cover: "/placeholder.svg",
  },
  {
    id: 8,
    title: "The Forgotten Library",
    author: "Elena Booksworth",
    genre: "Mystery",
    tags: ["Mystery", "Magic", "Ancient Artifact"],
    description:
      "An archaeologist discovers a hidden library containing secrets that powerful organizations will kill to protect.",
    cover: "/placeholder.svg",
  },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(true)
  const [displayedCount, setDisplayedCount] = useState(3)

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
        story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(story.genre)

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => story.tags.includes(tag))

      return matchesSearch && matchesGenre && matchesTags
    })
  }, [searchQuery, selectedGenres, selectedTags])

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
                          src={story.cover || "/placeholder.svg"}
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
                        {story.tags.slice(0, 2).map((tag) => (
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
                          src={story.cover || "/placeholder.svg"}
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
                          {story.tags.map((tag) => (
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
