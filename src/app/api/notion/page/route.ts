import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

/**
 * POST /api/notion/page
 * Creates a new page in a Notion database
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { databaseId, accessToken, content } = body

    if (!databaseId || !accessToken || !content) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const notion = new Client({ auth: accessToken })
    
    const response = await notion.pages.create({
      parent: { type: 'database_id', database_id: databaseId },
      properties: {
        title: [{ text: { content } }],
      },
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating Notion page:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}