"use client"

import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isOpen: boolean
  isDestructive?: boolean
}

export function ConfirmationModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isOpen,
  isDestructive = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-foreground/70 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel} className="border-border hover:bg-foreground/5 bg-transparent">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
