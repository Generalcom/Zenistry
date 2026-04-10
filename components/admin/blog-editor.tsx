'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Save, Eye, EyeOff, Plus, Trash2, Calendar, User, Tag, 
  FileText, Image as ImageIcon 
} from 'lucide-react'
import { BlogPost, updateBlogPost, createBlogPost, generateSlug, generateExcerpt } from '@/lib/content-manager'

interface BlogEditorProps {
  post?: BlogPost
  onSave?: (post: BlogPost) => void
  onCancel?: () => void
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '')
  const [author, setAuthor] = useState(post?.author || 'ZENistry Team')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(post?.status || 'draft')
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  // Auto-generate slug and excerpt when title changes
  useEffect(() => {
    if (title && !post?.id) {
      setExcerpt(generateExcerpt(content))
    }
  }, [title, content, post?.id])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    if (!content.trim()) {
      toast.error('Content is required')
      return
    }

    setIsLoading(true)
    
    try {
      const postData = {
        title: title.trim(),
        slug: post?.slug || generateSlug(title),
        excerpt: excerpt.trim() || generateExcerpt(content),
        content: content.trim(),
        featuredImage: featuredImage.trim(),
        author: author.trim(),
        status,
        tags: tags.filter(tag => tag.trim()),
      }

      let result
      if (post?.id) {
        result = await updateBlogPost(post.id, postData)
      } else {
        result = await createBlogPost(postData)
      }

      if (result.success) {
        toast.success(result.message || 'Blog post saved successfully')
        onSave?.(result.data)
      } else {
        toast.error(result.message || 'Failed to save blog post')
      }
    } catch (error) {
      toast.error('An error occurred while saving blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {post?.id ? 'Edit Blog Post' : 'Create Blog Post'}
        </h3>
        <Button
          type="button"
          variant={preview ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreview(!preview)}
          className="gap-1"
        >
          {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {preview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {preview ? (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || 'Untitled Post'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {author || 'Unknown Author'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post?.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === 'published' ? 'bg-green-100 text-green-800' :
                status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {featuredImage && (
            <div className="mb-6">
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
          
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '<p>No content to preview</p>' }}
          />
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
              placeholder="Enter blog post title..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of the post..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {excerpt.length}/150 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <Input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            {featuredImage && (
              <div className="mt-2">
                <img
                  src={featuredImage}
                  alt="Featured image preview"
                  className="h-32 w-auto rounded border border-gray-200"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex gap-2">
              {[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={status === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus(value as 'draft' | 'published' | 'archived')}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              rows={12}
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use HTML tags for formatting
            </p>
          </div>
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
          disabled={isLoading || !title.trim() || !content.trim()}
          className="gap-1"
        >
          {isLoading ? 'Saving...' : <Save className="w-4 h-4" />}
          {post?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  )
}
