import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import axios from 'axios'

/**
 * POST /api/discord
 * Handles Discord Webhook connection
 */

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      channel_id,
      webhook_id,
      webhook_name,
      webhook_url,
      user_id,
      guild_name,
      guild_id,
    } = body

    if (!webhook_id) {
      return NextResponse.json({ error: 'Missing webhook_id' }, { status: 400 })
    }

    // Check if webhook exists for the user
    const existingWebhook = await db.discordWebhook.findFirst({
      where: { userId: user_id },
      include: { connections: { select: { type: true } } },
    })

    // Create a new webhook if not found
    if (!existingWebhook) {
      await db.discordWebhook.create({
        data: {
          userId: user_id,
          webhookId: webhook_id,
          channelId: channel_id!,
          guildId: guild_id!,
          name: webhook_name!,
          url: webhook_url!,
          guildName: guild_name!,
          connections: {
            create: {
              userId: user_id,
              type: 'Discord',
            },
          },
        },
      })
      return NextResponse.json({ message: 'Webhook created' }, { status: 201 })
    }

    // Check if webhook exists for the same channel
    const existingChannelWebhook = await db.discordWebhook.findUnique({
      where: { channelId: channel_id },
    })

    if (!existingChannelWebhook) {
      await db.discordWebhook.create({
        data: {
          userId: user_id,
          webhookId: webhook_id,
          channelId: channel_id!,
          guildId: guild_id!,
          name: webhook_name!,
          url: webhook_url!,
          guildName: guild_name!,
          connections: {
            create: {
              userId: user_id,
              type: 'Discord',
            },
          },
        },
      })
      return NextResponse.json({ message: 'Webhook added for channel' }, { status: 201 })
    }

    return NextResponse.json({ message: 'Webhook already exists' }, { status: 200 })
  } catch (error) {
    console.error('Error connecting Discord Webhook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * GET /api/discord
 * Fetches the current user's Discord connection
 */
export async function GET(req: Request) {
  const userId = req.headers.get("userId");
  try {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const webhook = await db.discordWebhook.findFirst({
      where: { userId },
      select: {
        url: true,
        name: true,
        guildName: true,
      },
    })

    if (!webhook) {
      return NextResponse.json({ error: 'No Discord connection found' }, { status: 404 })
    }

    return NextResponse.json(webhook, { status: 200 })
  } catch (error) {
    console.error('Error fetching Discord connection:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * POST /api/discord/post
 * Posts content to a Discord webhook
 */
export async function POST_post(req: Request) {
  try {
    const { content, url } = await req.json()

    if (!content.trim()) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 })
    }

    const response = await axios.post(url, { content })

    if (response.status === 204) {
      return NextResponse.json({ message: 'Success' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Failed to post' }, { status: 500 })
  } catch (error) {
    console.error('Error posting to Discord webhook:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}