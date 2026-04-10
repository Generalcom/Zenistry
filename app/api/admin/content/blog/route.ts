import { NextRequest, NextResponse } from 'next/server'
import { BlogPost } from '@/lib/content-manager'

// In-memory storage for demo purposes
// In production, this should be stored in a database
let blogPosts: Record<string, BlogPost> = {}

// Initialize with some default blog posts
const defaultPosts: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Welcome to ZENistry Blog',
    slug: 'welcome-to-zenistry-blog',
    excerpt: 'Discover the latest in natural wellness and holistic health.',
    content: `<p>Welcome to the ZENistry blog, your source for natural wellness insights, product highlights, and holistic health tips.</p>
    <p>Here we share our passion for bringing you the finest natural products that support your journey to optimal health and wellbeing.</p>`,
    author: 'ZENistry Team',
    status: 'published',
    tags: ['wellness', 'natural', 'health'],
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'The Benefits of Ashwagandha',
    slug: 'benefits-of-ashwagandha',
    excerpt: 'Learn about this powerful adaptogen and its numerous health benefits.',
    content: `<p>Ashwagandha has been used for thousands of years in Ayurvedic medicine for its powerful health benefits.</p>
    <h3>Key Benefits:</h3>
    <ul>
      <li>Stress reduction and anxiety relief</li>
      <li>Improved sleep quality</li>
      <li>Enhanced cognitive function</li>
      <li>Increased energy and stamina</li>
    </ul>
    <p>Our Ashwagandha & Black Seed Oil Infused Honey combines this powerful adaptogen with the natural goodness of honey for a delicious and effective wellness supplement.</p>`,
    author: 'ZENistry Team',
    status: 'published',
    tags: ['ashwagandha', 'adaptogens', 'wellness', 'herbs'],
    publishedAt: new Date().toISOString(),
  },
]

// Initialize default posts
Object.values(defaultPosts).forEach((post, index) => {
  const id = `post_${index + 1}`
  blogPosts[id] = {
    ...post,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
})

// GET - Get all blog posts
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      posts: Object.values(blogPosts),
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST - Handle blog post operations
export async function POST(request: NextRequest) {
  try {
    const { action, id, data } = await request.json()

    switch (action) {
      case 'get':
        if (!id) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          post: blogPosts[id] || null,
        })

      case 'getAll':
        return NextResponse.json({
          success: true,
          posts: Object.values(blogPosts),
        })

      case 'create':
        if (!data) {
          return NextResponse.json(
            { error: 'Post data is required' },
            { status: 400 }
          )
        }
        
        const newId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newPost: BlogPost = {
          ...data,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        // Set publishedAt if status is published
        if (data.status === 'published' && !data.publishedAt) {
          newPost.publishedAt = new Date().toISOString()
        }
        
        blogPosts[newId] = newPost
        
        return NextResponse.json({
          success: true,
          post: newPost,
          message: 'Blog post created successfully',
        })

      case 'update':
        if (!id || !data) {
          return NextResponse.json(
            { error: 'Post ID and data are required' },
            { status: 400 }
          )
        }
        
        if (!blogPosts[id]) {
          return NextResponse.json(
            { error: 'Blog post not found' },
            { status: 404 }
          )
        }
        
        blogPosts[id] = {
          ...blogPosts[id],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        
        // Set publishedAt if status is being changed to published
        if (data.status === 'published' && !blogPosts[id].publishedAt) {
          blogPosts[id].publishedAt = new Date().toISOString()
        }
        
        return NextResponse.json({
          success: true,
          post: blogPosts[id],
          message: 'Blog post updated successfully',
        })

      case 'delete':
        if (!id) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          )
        }
        
        if (!blogPosts[id]) {
          return NextResponse.json(
            { error: 'Blog post not found' },
            { status: 404 }
          )
        }
        
        delete blogPosts[id]
        
        return NextResponse.json({
          success: true,
          message: 'Blog post deleted successfully',
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in blog posts API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
