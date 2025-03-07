import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * POST /api/notion
 * Handles Notion Webhook connection
 */

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      access_token,
      workspace_id,
      workspace_icon,
      workspace_name,
      database_id,
      id
    } = body

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
    }

    // Check if webhook exists for the user
    const notion_connected = await db.notion.findFirst({
      where: { accessToken: access_token, },
      include: { connections: { select: { type: true } } },
    })

    // Create a new webhook if not found
    if (!notion_connected) {
      await db.notion.create({
        data: {
          userId: String(id),
          workspaceIcon: workspace_icon!,
          accessToken: access_token,
          workspaceId: workspace_id!,
          workspaceName: workspace_name!,
          databaseId: database_id,
          connections: {
            create: {
              userId: String(id),
              type: 'Notion',
            },
          },
        },
      })
    }
    return NextResponse.json({ message: 'Notion connected' }, { status: 201 })
  } catch (error) {
    console.error('Error connecting Notion:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * GET /api/notion
 * Fetches the current user's Notion connection
 */
export async function GET(req: Request) {
  const userId = req.headers.get("userId");
  try {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const connection = await db.notion.findFirst({
      where: {
        userId,
      },
    })

    if (!connection) {
      return NextResponse.json({ error: 'No Notion connection found' }, { status: 404 })
    }

    return NextResponse.json(connection, { status: 200 })
  } catch (error) {
    console.error('Error fetching Notion connection:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}