'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Eye, EyeOff, Save, RotateCcw, Plus, Trash2, 
  Type, Image as ImageIcon, FileText, Edit3 
} from 'lucide-react'
import { ContentSection, updateContentSection, createContentSection, deleteContentSection } from '@/lib/content-manager'

interface ContentEditorProps {
  section?: ContentSection
  onSave?: (section: ContentSection) => void
  onCancel?: () => void
}

export function ContentEditor({ section, onSave, onCancel }: ContentEditorProps) {
  const [title, setTitle] = useState(section?.title || '')
  const [content, setContent] = useState(section?.content || '')
  const [type, setType] = useState<'text' | 'image' | 'html'>(section?.type || 'text')
  const [alt, setAlt] = useState(section?.metadata?.alt || '')
  const [caption, setCaption] = useState(section?.metadata?.caption || '')
  const [category, setCategory] = useState(section?.metadata?.category || '')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsLoading(true)
    
    try {
      const sectionData = {
        title: title.trim(),
        content: content.trim(),
        type,
        metadata: {
          alt: alt.trim(),
          caption: caption.trim(),
          category: category.trim(),
        },
      }

      let result
      if (section?.id) {
        result = await updateContentSection(section.id, sectionData)
      } else {
        result = await createContentSection(sectionData)
      }

      if (result.success) {
        toast.success(result.message || 'Content saved successfully')
        onSave?.(result.data)
      } else {
        toast.error(result.message || 'Failed to save content')
      }
    } catch (error) {
      toast.error('An error occurred while saving content')
    } finally {
      setIsLoading(false)
    }
  }

  const renderContentEditor = () => {
    switch (type) {
      case 'text':
        return (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter text content..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )
      
      case 'html':
        return (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter HTML content..."
            className="w-full h-64 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        )
      
      case 'image':
        return (
          <div className="space-y-4">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter image URL..."
            />
            <Input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Alt text for accessibility..."
            />
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption..."
            />
            {content && (
              <div className="mt-4">
                <img
                  src={content}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  const renderPreview = () => {
    switch (type) {
      case 'text':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{content || 'No content to preview'}</p>
          </div>
        )
      
      case 'html':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: content || '<p>No content to preview</p>' }} />
          </div>
        )
      
      case 'image':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            {content ? (
              <div className="space-y-2">
                <img
                  src={content}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
                {caption && <p className="text-sm text-gray-600 italic">{caption}</p>}
              </div>
            ) : (
              <p className="text-gray-500">No image to preview</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {section?.id ? 'Edit Content' : 'Create Content'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={preview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreview(!preview)}
            className="gap-1"
          >
            {preview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900">{title || 'Untitled'}</h4>
            <p className="text-sm text-gray-500">Type: {type}</p>
          </div>
          {renderPreview()}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <div className="flex gap-2">
              {[
                { value: 'text', label: 'Text', icon: FileText },
                { value: 'image', label: 'Image', icon: ImageIcon },
                { value: 'html', label: 'HTML', icon: Type },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={type === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setType(value as 'text' | 'image' | 'html')}
                  className="gap-1"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            {renderContentEditor()}
          </div>

          {(type === 'image' || type === 'text') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="hero, about, contact, footer, etc..."
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isLoading || !title.trim()}
          className="gap-1"
        >
          {isLoading ? 'Saving...' : <Save className="w-4 h-4" />}
          {section?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
