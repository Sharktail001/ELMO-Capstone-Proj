// src/app/explore/components/SearchBar.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Search, ArrowRight, Loader2 } from "lucide-react"

interface SearchBarProps {
  prompt: string
  setPrompt: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
}

export default function SearchBar({ prompt, setPrompt, handleSubmit, isLoading }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto mb-10">
      <form onSubmit={handleSubmit} className="group">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="pl-12 pr-12 py-7 text-lg rounded-full border-gray-200 shadow-lg bg-white focus-visible:ring-[#FF7E77] focus-visible:ring-offset-2 transition-all duration-300"
          placeholder="What would you like to learn about today?"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 transition-all duration-300 group-focus-within:text-[#FF7E77]">
          <Search />
        </div>
        <button
          type="submit"
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-[#FF7E77] text-white rounded-full transition-all duration-300 ease-in-out ${
            prompt ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } hover:bg-[#FF5951]`}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        </button>
      </form>
    </div>
  )
}