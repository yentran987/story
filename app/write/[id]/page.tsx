"use client"

import { useState } from "react"
import { Plus, Settings, Eye, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

const chapters = [
  { id: 1, title: "The Beginning", status: "published" },
  { id: 2, title: "A New Challenge", status: "draft" },
  { id: 3, title: "Untitled", status: "draft" },
]

export default function StoryEditorPage({ params }: { params: { id: string } }) {
  const [selectedChapter, setSelectedChapter] = useState(2)
  const [content, setContent] = useState(
    "The air was crisp and cold, carrying the scent of pine and distant snow. As Marcus climbed higher into the mountain pass, each breath became harder, his lungs burning with effort. But he couldn't stop now. The prophecy had been clear, and time was running out.\n\nHe thought back to the village, to the faces of those who had sent him on this impossible quest. They had looked at him with equal parts hope and desperation, as if their entire world depended on what he would find at the summit.",
  )
  const [title, setTitle] = useState("Chapter 2: A New Challenge")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Editor Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur px-4 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">The Lost Relic</h2>
            <p className="text-sm text-foreground/60">All changes saved</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="border-border bg-transparent">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-border bg-transparent">
              <Settings className="w-4 h-4" />
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Send className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl mx-auto w-full gap-6 px-4 py-8">
        {/* Sidebar - Chapters */}
        <div className="w-64 flex-shrink-0 border border-border rounded-lg bg-card/30 p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Chapters</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter.id)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedChapter === chapter.id
                    ? "bg-purple-900/50 border border-purple-500/50"
                    : "hover:bg-foreground/5"
                }`}
              >
                <p className="text-sm font-medium">{chapter.title}</p>
                <p className={`text-xs ${chapter.status === "published" ? "text-green-400" : "text-yellow-400"}`}>
                  {chapter.status === "published" ? "✓ Published" : "● Draft"}
                </p>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-border bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            New Chapter
          </Button>
        </div>

        {/* Main Editor */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-b border-border pb-4 outline-none placeholder-foreground/40"
            placeholder="Chapter Title"
          />

          {/* Editor */}
          <div className="bg-card/30 border border-border rounded-lg overflow-hidden flex flex-col h-96">
            {/* Toolbar */}
            <div className="border-b border-border bg-card/50 p-3 flex items-center gap-2 flex-wrap">
              <button className="p-2 hover:bg-foreground/10 rounded transition">
                <strong>B</strong>
              </button>
              <button className="p-2 hover:bg-foreground/10 rounded transition">
                <em>I</em>
              </button>
              <button className="p-2 hover:bg-foreground/10 rounded transition">
                <u>U</u>
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button className="p-2 hover:bg-foreground/10 rounded transition">≡</button>
              <button className="p-2 hover:bg-foreground/10 rounded transition">•</button>
            </div>

            {/* Text Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 bg-transparent border-none outline-none resize-none"
              placeholder="Write your chapter content here..."
            />
          </div>

          {/* Word Count & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-foreground/60">
              Words: <span className="font-semibold">{content.split(/\s+/).length}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border bg-transparent">
                Save as Draft
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                <Send className="w-4 h-4" />
                Publish Chapter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
