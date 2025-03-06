import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

/**
 * GET /api/notion/database
 * Fetches a Notion database by ID
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const databaseId = searchParams.get('databaseId')
    const accessToken = searchParams.get('accessToken')

    if (!databaseId || !accessToken) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const notion = new Client({ auth: accessToken })
    const database = await notion.databases.retrieve({ database_id: databaseId })

    return NextResponse.json(database, { status: 200 })
  } catch (error) {
    console.error('Error fetching Notion database:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}