'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Mail, MessageSquare, Search,
  Eye, EyeOff, Reply, Archive, Trash2, Download,
  Calendar, CheckCircle2, AlertCircle, Tag
} from 'lucide-react'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  status: 'new' | 'read' | 'replied'
  category: 'general' | 'product' | 'order' | 'technical'
}

export function ContactManagement() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'product' | 'order' | 'technical'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions)
        setFilteredSubmissions(data.submissions)
      } else {
        toast.error('Failed to load contact submissions')
      }
    } catch (error) {
      console.error('Error loading contact submissions:', error)
      toast.error('An error occurred while loading submissions')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const result = await response.json()
      if (result.success) {
        setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)))
        toast.success(`Submission marked as ${status}`)
      } else {
        toast.error('Failed to update submission status')
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      toast.error('An error occurred while updating submission')
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) return
    try {
      const response = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const result = await response.json()
      if (result.success) {
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id))
        setSelectedSubmission(null)
        toast.success('Submission deleted successfully')
      } else {
        toast.error('Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast.error('An error occurred while deleting submission')
    }
  }

  const exportSubmissions = () => {
    const data = { submissions: filteredSubmissions, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Contact submissions exported successfully')
  }

  useEffect(() => {
    let filtered = submissions
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((sub) => sub.category === selectedCategory)
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((sub) => sub.status === selectedStatus)
    }
    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, selectedCategory, selectedStatus])

  const getStatusColor = (status: ContactSubmission['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: ContactSubmission['category']) => {
    switch (category) {
      case 'general': return <Mail className="w-4 h-4" />
      case 'product': return <Tag className="w-4 h-4" />
      case 'order': return <Archive className="w-4 h-4" />
      case 'technical': return <AlertCircle className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Contact Management</h2>
        <Button onClick={exportSubmissions} variant="outline" size="sm" className="gap-1">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as typeof selectedCategory)}
              className="w-full px-3 py-2 border border-border/50 rounded-lg focus:border-accent bg-background text-sm"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="order">Order</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              className="w-full px-3 py-2 border border-border/50 rounded-lg focus:border-accent bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading contact submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contact submissions found</p>
          <p className="text-sm text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'No submissions yet'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-foreground">Subject</th>
                  <th className="text-left p-4 font-medium text-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{submission.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{submission.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(submission.category)}
                        <span className="text-sm capitalize">{submission.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium truncate max-w-xs">{submission.subject}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(submission.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedSubmission(submission)} className="gap-1">
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                        {submission.status === 'new' && (
                          <Button size="sm" variant="outline" onClick={() => updateSubmissionStatus(submission.id, 'read')} className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Mark Read
                          </Button>
                        )}
                        {submission.status === 'read' && (
                          <Button size="sm" variant="outline" onClick={() => updateSubmissionStatus(submission.id, 'replied')} className="gap-1">
                            <Reply className="w-3 h-3" />
                            Mark Replied
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => deleteSubmission(submission.id)} className="gap-1 text-red-600 hover:text-red-700">
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
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground">Contact Submission Details</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)} className="gap-1">
                <EyeOff className="w-4 h-4" />
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <p className="text-foreground">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <p className="text-foreground">{selectedSubmission.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <p className="text-foreground capitalize">{selectedSubmission.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                <p className="text-foreground">{selectedSubmission.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                <p className="text-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-lg text-sm">
                  {selectedSubmission.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                <p className="text-foreground text-sm">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
              </div>

              {selectedSubmission.phone && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <p className="text-foreground">{selectedSubmission.phone}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border/50">
                {selectedSubmission.status === 'new' && (
                  <Button onClick={() => updateSubmissionStatus(selectedSubmission.id, 'read')} className="gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Read
                  </Button>
                )}
                {selectedSubmission.status === 'read' && (
                  <Button onClick={() => updateSubmissionStatus(selectedSubmission.id, 'replied')} className="gap-1">
                    <Reply className="w-4 h-4" />
                    Mark as Replied
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
