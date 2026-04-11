import { NextRequest, NextResponse } from 'next/server'

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

// In-memory storage for demo purposes
// In production, this should be stored in a database
let contactSubmissions: ContactSubmission[] = []

// Initialize with some sample submissions
const sampleSubmissions: Omit<ContactSubmission, 'id' | 'createdAt'>[] = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+27 82 123 4567',
    subject: 'Question about Ashwagandha honey',
    message: 'Hi, I was wondering if your Ashwagandha honey is safe for children? My daughter is 8 years old and I want to make sure before purchasing. Thank you!',
    category: 'product',
    status: 'new'
  },
  {
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    subject: 'Order tracking issue',
    message: 'I placed order #12345 last week but haven\'t received any shipping updates. Can you please check the status for me?',
    category: 'order',
    status: 'read'
  }
]

// Initialize sample submissions
sampleSubmissions.forEach((submission, index) => {
  contactSubmissions.push({
    ...submission,
    id: `contact_${index + 1}`,
    createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString()
  })
})

// GET - Retrieve all contact submissions
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      submissions: contactSubmissions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}

// POST - Handle new contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate message length
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      )
    }

    // Create new submission
    const newSubmission: ContactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      subject: body.subject.trim(),
      message: body.message.trim(),
      category: body.category || 'general',
      status: 'new',
      createdAt: new Date().toISOString()
    }

    // Store submission
    contactSubmissions.push(newSubmission)

    // In production, you would also:
    // - Send email notification to admin
    // - Send confirmation email to customer
    // - Store in database
    // - Log for analytics

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submission: newSubmission
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update submission status (mark as read, replied, etc.)
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Submission ID and status are required' },
        { status: 400 }
      )
    }

    const submissionIndex = contactSubmissions.findIndex(s => s.id === id)
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    contactSubmissions[submissionIndex].status = status

    return NextResponse.json({
      success: true,
      message: 'Submission status updated successfully',
      submission: contactSubmissions[submissionIndex]
    })
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove submission
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const submissionIndex = contactSubmissions.findIndex(s => s.id === id)
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    const deletedSubmission = contactSubmissions[submissionIndex]
    contactSubmissions.splice(submissionIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully',
      submission: deletedSubmission
    })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
