import React from 'react'
import { BookOpen } from 'lucide-react'

function Header() {
  return (
    <header className="h-[12vh] border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between px-6 select-none transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/10">
          <BookOpen size={20} className="stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tight text-[var(--text-primary)] font-[Inter]">
            MarkDown <span className="text-[var(--accent)]">Reader</span>
          </h1>
          <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest -mt-0.5">
            Optimize &amp; Read Markdown Files
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header