"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"

export default function EditProfilePage() {
  const [profileData, setProfileData] = useState({
    username: "alexwriter01",
    email: "alex@example.com",
    bio: "Crafting worlds one word at a time. Coffee-fueled storyteller and lover of fantasy epics.",
    website: "alexwrites.com",
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
        <p className="text-foreground/70 mb-8">Update your profile information</p>

        <div className="bg-card/30 border border-border rounded-lg p-8 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="bg-card/50 border-border"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-card/50 border border-border rounded-lg text-foreground min-h-24 resize-none"
              placeholder="Tell us about yourself"
            />
            <p className="text-xs text-foreground/60 mt-1">{profileData.bio.length}/200</p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              value={profileData.website}
              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              placeholder="https://"
              className="bg-card/50 border-border"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Link href="/profile">
              <Button variant="outline" className="border-border hover:bg-foreground/5 bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
