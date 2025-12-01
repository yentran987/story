"use client"

import Link from "next/link"
import Image from "next/image"
import { Edit3, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="grid md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-border">
          {/* Avatar */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 border-4 border-border">
              <span className="text-5xl">🖊️</span>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline" className="border-border hover:bg-foreground/5 gap-2 bg-transparent">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Profile Info */}
          <div className="md:col-span-3">
            <h1 className="text-4xl font-bold mb-2">alexwriter01</h1>
            <p className="text-foreground/70 mb-6 text-lg">
              Crafting worlds one word at a time. Coffee-fueled storyteller and lover of fantasy epics.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-2xl font-bold text-purple-400">12</p>
                <p className="text-sm text-foreground/60">Stories Written</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">1.2K</p>
                <p className="text-sm text-foreground/60">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">158</p>
                <p className="text-sm text-foreground/60">Following</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="border-border hover:bg-foreground/5 gap-2 bg-transparent">
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              <Button variant="outline" className="border-border hover:bg-foreground/5 gap-2 bg-transparent">
                <Users className="w-4 h-4" />
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-border">
          <button className="pb-4 font-semibold text-purple-400 border-b-2 border-purple-400">My Stories</button>
          <button className="pb-4 font-semibold text-foreground/70 hover:text-foreground transition">
            Achievements
          </button>
          <button className="pb-4 font-semibold text-foreground/70 hover:text-foreground transition">Activity</button>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "The Crimson Cipher", genre: "Fantasy" },
            { title: "Echoes of a Lost Star", genre: "Sci-Fi" },
            { title: "The Last Librarian", genre: "Adventure" },
            { title: "Cybernetic Dreams", genre: "Cyberpunk" },
            { title: "The Serpent's Heir", genre: "Fantasy" },
            { title: "City of Gears", genre: "Steampunk" },
            { title: "The Sunken Crown", genre: "Fantasy" },
            { title: "Neon Prophecy", genre: "Sci-Fi" },
          ].map((story, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-card border border-border aspect-[3/4]">
                <Image
                  src={`/generic-placeholder-graphic.png?key=${idx}`}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold text-sm group-hover:text-purple-400 transition line-clamp-2">
                {story.title}
              </h3>
              <p className="text-xs text-foreground/60">{story.genre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
