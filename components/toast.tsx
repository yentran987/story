"use client"

import { useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const toastStore: { toasts: Toast[]; listeners: Set<() => void> } = {
  toasts: [],
  listeners: new Set(),
}

export function useToast() {
  const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, type, message, duration }
    toastStore.toasts.push(toast)
    toastStore.listeners.forEach((listener) => listener())

    if (duration > 0) {
      setTimeout(() => {
        toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
        toastStore.listeners.forEach((listener) => listener())
      }, duration)
    }
  }, [])

  return { addToast }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useState(() => {
    const listener = () => setToasts([...toastStore.toasts])
    toastStore.listeners.add(listener)
    return () => toastStore.listeners.delete(listener)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-green-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
          info: <Info className="w-5 h-5 text-blue-400" />,
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur ${
              toast.type === "success"
                ? "bg-green-900/30 border-green-500/50"
                : toast.type === "error"
                  ? "bg-red-900/30 border-red-500/50"
                  : toast.type === "warning"
                    ? "bg-yellow-900/30 border-yellow-500/50"
                    : "bg-blue-900/30 border-blue-500/50"
            }`}
          >
            {icons[toast.type]}
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => {
                toastStore.toasts = toastStore.toasts.filter((t) => t.id !== toast.id)
                toastStore.listeners.forEach((listener) => listener())
              }}
              className="text-foreground/60 hover:text-foreground transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
