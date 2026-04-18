'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Save, RotateCcw } from 'lucide-react'
import { EDITABLE_SECTIONS, getAllContent, setContent, resetContent } from '@/lib/content-manager'

const CATEGORIES = Array.from(new Set(EDITABLE_SECTIONS.map(s => s.category)))

export function ContentDashboard() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<Record<string, string>>({})
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    setValues(getAllContent())
  }, [])

  const getValue = (id: string, fallback = '') =>
    values[id] !== undefined ? values[id] : fallback

  const startEdit = (id: string) => {
    const current = values[id] !== undefined ? values[id] : ''
    setEditing(prev => ({ ...prev, [id]: current }))
    setOpenId(id)
  }

  const cancelEdit = (id: string) => {
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n })
    setOpenId(null)
  }

  const saveEdit = (id: string) => {
    const val = editing[id] ?? ''
    setContent(id, val)
    setValues(prev => ({ ...prev, [id]: val }))
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n })
    setOpenId(null)
    toast.success('Content saved')
  }

  const handleReset = (id: string) => {
    resetContent(id)
    setValues(prev => { const n = { ...prev }; delete n[id]; return n })
    setOpenId(null)
    toast.success('Reset to default')
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Edit any text shown on the site. Changes take effect immediately for all visitors.
      </p>
      {CATEGORIES.map(category => {
        const sections = EDITABLE_SECTIONS.filter(s => s.category === category)
        return (
          <div key={category} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/50 bg-secondary/20">
              <h3 className="font-medium text-foreground text-sm">{category}</h3>
            </div>
            <div className="divide-y divide-border/40">
              {sections.map(section => {
                const isOpen = openId === section.id
                const hasOverride = values[section.id] !== undefined
                return (
                  <div key={section.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{section.label}</p>
                          {hasOverride && (
                            <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">Edited</span>
                          )}
                        </div>
                        {!isOpen && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                            {getValue(section.id, '—')}
                          </p>
                        )}
                      </div>
                      {!isOpen && (
                        <Button size="sm" variant="outline" onClick={() => startEdit(section.id)} className="shrink-0">
                          Edit
                        </Button>
                      )}
                    </div>

                    {isOpen && (
                      <div className="space-y-3">
                        {section.multiline ? (
                          <textarea
                            rows={3}
                            value={editing[section.id] ?? ''}
                            onChange={e => setEditing(prev => ({ ...prev, [section.id]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-md border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                        ) : (
                          <Input
                            value={editing[section.id] ?? ''}
                            onChange={e => setEditing(prev => ({ ...prev, [section.id]: e.target.value }))}
                            className="bg-background border-border/50 text-sm"
                          />
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(section.id)} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Save className="w-3.5 h-3.5" /> Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => cancelEdit(section.id)}>
                            Cancel
                          </Button>
                          {hasOverride && (
                            <Button size="sm" variant="outline" onClick={() => handleReset(section.id)} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 ml-auto">
                              <RotateCcw className="w-3.5 h-3.5" /> Reset
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
