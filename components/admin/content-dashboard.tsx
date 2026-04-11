'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Plus, Search, Edit3, Trash2, Eye, EyeOff, 
  FileText, Image as ImageIcon, Calendar, Tag, Filter,
  SortAsc, Download, Upload, User
} from 'lucide-react'
import { ContentSection, BlogPost, getAllContentSections, getAllBlogPosts, deleteContentSection, deleteBlogPost } from '@/lib/content-manager'
import { ContentEditor } from './content-editor'
import { BlogEditor } from './blog-editor'
import { ContactManagement } from './contact-management'

export function ContentDashboard() {
  const [activeTab, setActiveTab] = useState<'content' | 'blog' | 'contact'>('content')
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'category'>('date')
  const [editingItem, setEditingItem] = useState<ContentSection | BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [sections, posts] = await Promise.all([
        getAllContentSections(),
        getAllBlogPosts()
      ])
      setContentSections(sections)
      setBlogPosts(posts)
    } catch (error) {
      toast.error('Failed to load content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContent = async (id: string, type: 'content' | 'blog') => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    try {
      let result
      if (type === 'content') {
        result = await deleteContentSection(id)
      } else {
        result = await deleteBlogPost(id)
      }

      if (result.success) {
        toast.success(result.message || 'Item deleted successfully')
        await loadData()
      } else {
        toast.error(result.message || 'Failed to delete item')
      }
    } catch (error) {
      toast.error('An error occurred while deleting')
    }
  }

  const filteredContent = contentSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || section.metadata?.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'category':
        return (a.metadata?.category || '').localeCompare(b.metadata?.category || '')
      default:
        return 0
    }
  })

  const sortedBlogPosts = [...filteredBlogPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  const categories = Array.from(new Set(contentSections.map(s => s.metadata?.category).filter(Boolean)))

  const handleExport = () => {
    const data = {
      contentSections,
      blogPosts,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zenistry-content-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Content exported successfully')
  }

  if (editingItem) {
    const isBlogPost = 'slug' in editingItem
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isBlogPost ? 'Edit Blog Post' : 'Edit Content'}
          </h2>
          <Button
            variant="outline"
            onClick={() => setEditingItem(null)}
          >
            Back to Dashboard
          </Button>
        </div>
        
        {isBlogPost ? (
          <BlogEditor
            post={editingItem as BlogPost}
            onSave={async (post) => {
              setEditingItem(null)
              await loadData()
            }}
            onCancel={() => setEditingItem(null)}
          />
        ) : (
          <ContentEditor
            section={editingItem as ContentSection}
            onSave={async (section) => {
              setEditingItem(null)
              await loadData()
            }}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'content' | 'blog' | 'contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab === 'content' ? 'content sections' : 'blog posts'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {activeTab === 'content' && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}

        {activeTab === 'blog' && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        )}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          {activeTab === 'content' && <option value="category">Sort by Category</option>}
        </select>
      </div>

      {/* Add New Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setEditingItem({} as any)}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add New {activeTab === 'content' ? 'Content' : 'Blog Post'}
        </Button>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading content...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          {activeTab === 'content' && sortedContent.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No content sections found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Create your first content section'}
              </p>
            </div>
          )}

          {activeTab === 'blog' && sortedBlogPosts.length === 0 && (
            <div className="text-center py-8">
              <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No blog posts found</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm || selectedStatus !== 'all' ? 'Try adjusting your filters' : 'Create your first blog post'}
              </p>
            </div>
          )}

          {/* Content Sections List */}
          {activeTab === 'content' && sortedContent.map((section) => (
            <div
              key={section.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      section.type === 'text' ? 'bg-blue-100 text-blue-800' :
                      section.type === 'image' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {section.type}
                    </span>
                    {section.metadata?.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {section.metadata.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {section.type === 'image' ? section.metadata?.caption : section.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Updated: {new Date(section.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(section)}
                    className="gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteContent(section.id, 'content')}
                    className="gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Blog Posts List */}
          {activeTab === 'blog' && sortedBlogPosts.map((post) => (
            <div
              key={post.id}
              className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                    {post.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.tags.length} tags
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(post)}
                    className="gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteContent(post.id, 'blog')}
                    className="gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Website Content</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setEditingItem({})}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Content
              </Button>
              <Button
                onClick={() => setEditingItem({})}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
            </div>
          </div>
          {editingItem && (
            <ContentEditor
              section={editingItem}
              onSave={(section) => {
                setEditingItem(null)
                setContentSections(prev => 
                  prev.map(s => s.id === section.id ? section : s)
                )
                toast.success('Content updated successfully')
              }}
              onCancel={() => setEditingItem(null)}
            />
          )}
          <div className="bg-card rounded-lg border border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-medium text-foreground">Title</th>
                    <th className="text-left p-4 font-medium text-foreground">Type</th>
                    <th className="text-left p-4 font-medium text-foreground">Category</th>
                    <th className="text-left p-4 font-medium text-foreground">Updated</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentSections.map((section) => (
                    <tr 
                      key={section.id} 
                      className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {section.type === 'text' && <FileText className="w-4 h-4 text-muted-foreground" />}
                          {section.type === 'image' && <ImageIcon className="w-4 h-4 text-muted-foreground" />}
                          {section.type === 'html' && <Edit3 className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <span className="font-medium">{section.title}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {section.metadata?.category && (
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                              {section.metadata.category}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-muted-foreground">
                          {new Date(section.updatedAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItem(section)}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteContentSection(section.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'contact' && (
        <ContactManagement />
      )}
    </div>
  )
}
