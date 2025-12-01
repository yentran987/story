"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

const trendingStories = [
  {
    id: 1,
    title: "The Crimson Cipher",
    author: "Amelia Reed",
    genre: "Fantasy",
    cover: "/placeholder.svg?key=dytgb",
  },
  {
    id: 2,
    title: "Echoes of a Lost Star",
    author: "Marcus Vance",
    genre: "Sci-Fi",
    cover: "/placeholder.svg?key=97xmb",
  },
  {
    id: 3,
    title: "City of Whispering Glass",
    author: "Clara Oswald",
    genre: "Mystery",
    cover: "/placeholder.svg?key=bixiz",
  },
  {
    id: 4,
    title: "Beneath the Serpent's Moon",
    author: "Julian Croft",
    genre: "Adventure",
    cover: "/placeholder.svg?key=ofxqb",
  },
  {
    id: 5,
    title: "The Last Technomancer",
    author: "Eva Rostova",
    genre: "Cyberpunk",
    cover: "/placeholder.svg?key=86j2f",
  },
]

export default function TrendingStoriesSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">Trending Stories</h2>
          <Link href="/browse" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {trendingStories.map((story) => (
            <Link key={story.id} href={`/story/${story.id}`}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                  <Image
                    src={story.cover || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-sm md:text-base group-hover:text-purple-400 transition line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs md:text-sm text-foreground/60">By {story.author}</p>
                <p className="text-xs text-purple-400 mt-1">{story.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
