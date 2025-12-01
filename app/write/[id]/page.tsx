"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Settings, Eye, Send, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function StoryEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [chapters, setChapters] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [storyTitle, setStoryTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [storyData, setStoryData] = useState<any>(null)
  const [showStorySettings, setShowStorySettings] = useState(false)

  useEffect(() => {
    const stories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const story = stories.find((s: any) => s.id === params.id)

    if (story) {
      setStoryTitle(story.title)
      setStoryData(story)
      if (story.chapters && story.chapters.length > 0) {
        setChapters(story.chapters)
        const firstChapter = story.chapters[0]
        setSelectedChapter(firstChapter.id)
        setTitle(firstChapter.title)
        setContent(firstChapter.content || "")
      } else {
        // New story with no chapters yet
        const newChapter = {
          id: 1,
          title: "Chapter 1",
          content: "",
          status: "draft",
        }
        setChapters([newChapter])
        setSelectedChapter(1)
        setTitle(newChapter.title)
        setContent("")
      }
    }
    setIsLoading(false)
  }, [params.id])

  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapter(chapterId)
    const chapter = chapters.find((c) => c.id === chapterId)
    if (chapter) {
      setTitle(chapter.title)
      setContent(chapter.content || "")
    }
  }

  const handleSaveChapter = () => {
    const updatedChapters = chapters.map((ch) => (ch.id === selectedChapter ? { ...ch, title, content } : ch))
    setChapters(updatedChapters)

    const stories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const storyIndex = stories.findIndex((s: any) => s.id === params.id)
    if (storyIndex !== -1) {
      stories[storyIndex].chapters = updatedChapters
      localStorage.setItem("storyweave_user_stories", JSON.stringify(stories))
    }

    alert("Chapter saved as draft!")
  }

  const handlePublishChapter = () => {
    const updatedChapters = chapters.map((ch) =>
      ch.id === selectedChapter ? { ...ch, title, content, status: "published" } : ch,
    )
    setChapters(updatedChapters)

    const stories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const storyIndex = stories.findIndex((s: any) => s.id === params.id)
    if (storyIndex !== -1) {
      stories[storyIndex].chapters = updatedChapters
      localStorage.setItem("storyweave_user_stories", JSON.stringify(stories))
    }

    alert("Chapter published successfully!")
  }

  const handlePublishStory = () => {
    const updatedChapters = chapters.map((ch) => ({ ...ch, status: "published" }))
    setChapters(updatedChapters)

    const stories = JSON.parse(localStorage.getItem("storyweave_user_stories") || "[]")
    const storyIndex = stories.findIndex((s: any) => s.id === params.id)
    if (storyIndex !== -1) {
      stories[storyIndex].chapters = updatedChapters
      stories[storyIndex].status = "published"
      localStorage.setItem("storyweave_user_stories", JSON.stringify(stories))
    }

    alert("Entire story published! All chapters are now live.")
  }

  const handleAddChapter = () => {
    const newChapterId = Math.max(...chapters.map((c) => c.id), 0) + 1
    const newChapter = {
      id: newChapterId,
      title: `Chapter ${newChapterId}`,
      content: "",
      status: "draft",
    }
    setChapters([...chapters, newChapter])
  }

  const handleBackClick = () => {
    router.push("/write")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Editor Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur px-4 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="flex-shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-semibold truncate">{storyTitle}</h2>
              <p className="text-xs md:text-sm text-foreground/60">All changes saved</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="border-border bg-transparent flex-shrink-0">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-border bg-transparent flex-shrink-0">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              onClick={handlePublishStory}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden md:inline">Publish Story</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-6 px-4 py-8">
        {/* Sidebar - Chapters */}
        <div className="w-full md:w-64 md:flex-shrink-0 border border-border rounded-lg bg-card/30 p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Chapters</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddChapter}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-96 md:max-h-96 overflow-y-auto">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterSelect(chapter.id)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedChapter === chapter.id
                    ? "bg-purple-900/50 border border-purple-500/50"
                    : "hover:bg-foreground/5"
                }`}
              >
                <p className="text-sm font-medium truncate">{chapter.title}</p>
                <p className={`text-xs ${chapter.status === "published" ? "text-green-400" : "text-yellow-400"}`}>
                  {chapter.status === "published" ? "✓ Published" : "● Draft"}
                </p>
              </button>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-border bg-transparent" onClick={handleAddChapter}>
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
            className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-border pb-4 outline-none placeholder-foreground/40"
            placeholder="Chapter Title"
          />

          {/* Editor */}
          <div className="bg-card/30 border border-border rounded-lg overflow-hidden flex flex-col h-96 md:h-96">
            {/* Toolbar */}
            <div className="border-b border-border bg-card/50 p-3 flex items-center gap-2 flex-wrap overflow-x-auto">
              <button className="p-2 hover:bg-foreground/10 rounded transition flex-shrink-0">
                <strong>B</strong>
              </button>
              <button className="p-2 hover:bg-foreground/10 rounded transition flex-shrink-0">
                <em>I</em>
              </button>
              <button className="p-2 hover:bg-foreground/10 rounded transition flex-shrink-0">
                <u>U</u>
              </button>
              <div className="w-px h-6 bg-border mx-1 flex-shrink-0" />
              <button className="p-2 hover:bg-foreground/10 rounded transition flex-shrink-0">≡</button>
              <button className="p-2 hover:bg-foreground/10 rounded transition flex-shrink-0">•</button>
            </div>

            {/* Text Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-4 bg-transparent border-none outline-none resize-none text-sm md:text-base"
              placeholder="Write your chapter content here..."
            />
          </div>

          {/* Word Count & Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="text-sm text-foreground/60">
              Words: <span className="font-semibold">{content.split(/\s+/).filter((w) => w).length}</span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                onClick={handleSaveChapter}
                variant="outline"
                className="flex-1 md:flex-none border-border bg-transparent"
              >
                Save Draft
              </Button>
              <Button
                onClick={handlePublishChapter}
                className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden md:inline">Publish Chapter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
