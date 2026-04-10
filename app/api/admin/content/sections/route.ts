import { NextRequest, NextResponse } from 'next/server'
import { ContentSection } from '@/lib/content-manager'

// In-memory storage for demo purposes
// In production, this should be stored in a database
let contentSections: Record<string, ContentSection> = {}

// Initialize with some default content sections
const defaultSections: Omit<ContentSection, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'text',
    title: 'Hero Title',
    content: 'Welcome to ZENistry',
    metadata: { category: 'hero' },
  },
  {
    type: 'text',
    title: 'Hero Subtitle',
    content: 'Your journey to natural wellness begins here',
    metadata: { category: 'hero' },
  },
  {
    type: 'text',
    title: 'About Us',
    content: 'ZENistry is dedicated to bringing you the finest natural wellness products...',
    metadata: { category: 'about' },
  },
  {
    type: 'text',
    title: 'Contact Email',
    content: 'info@zenistry.com',
    metadata: { category: 'contact' },
  },
  {
    type: 'text',
    title: 'Contact Phone',
    content: '+27 12 345 6789',
    metadata: { category: 'contact' },
  },
  {
    type: 'text',
    title: 'Footer Copyright',
    content: '© 2024 ZENistry. All rights reserved.',
    metadata: { category: 'footer' },
  },
]

// Initialize default sections
Object.values(defaultSections).forEach((section, index) => {
  const id = `section_${index + 1}`
  contentSections[id] = {
    ...section,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})

// GET - Get all content sections
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      sections: Object.values(contentSections),
    })
  } catch (error) {
    console.error('Error fetching content sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content sections' },
      { status: 500 }
    )
  }
}

// POST - Handle content section operations
export async function POST(request: NextRequest) {
  try {
    const { action, id, data } = await request.json()

    switch (action) {
      case 'get':
        if (!id) {
          return NextResponse.json(
            { error: 'Section ID is required' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          section: contentSections[id] || null,
        })

      case 'getAll':
        return NextResponse.json({
          success: true,
          sections: Object.values(contentSections),
        })

      case 'create':
        if (!data) {
          return NextResponse.json(
            { error: 'Section data is required' },
            { status: 400 }
          )
        }
        
        const newId = `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newSection: ContentSection = {
          ...data,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        contentSections[newId] = newSection
        
        return NextResponse.json({
          success: true,
          section: newSection,
          message: 'Content section created successfully',
        })

      case 'update':
        if (!id || !data) {
          return NextResponse.json(
            { error: 'Section ID and data are required' },
            { status: 400 }
          )
        }
        
        if (!contentSections[id]) {
          return NextResponse.json(
            { error: 'Content section not found' },
            { status: 404 }
          )
        }
        
        contentSections[id] = {
          ...contentSections[id],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        
        return NextResponse.json({
          success: true,
          section: contentSections[id],
          message: 'Content section updated successfully',
        })

      case 'delete':
        if (!id) {
          return NextResponse.json(
            { error: 'Section ID is required' },
            { status: 400 }
          )
        }
        
        if (!contentSections[id]) {
          return NextResponse.json(
            { error: 'Content section not found' },
            { status: 404 }
          )
        }
        
        delete contentSections[id]
        
        return NextResponse.json({
          success: true,
          message: 'Content section deleted successfully',
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in content sections API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
