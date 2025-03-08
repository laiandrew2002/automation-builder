/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { Option } from '@/components/ui/multiple-selector'

// 📌 GET Nodes & Edges
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const flowId = searchParams.get('flowId')

  if (!flowId) return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 })

  const nodesEdges = await db.workflows.findUnique({
    where: { id: flowId },
    select: { nodes: true, edges: true },
  })

  return NextResponse.json(nodesEdges || {})
}

// 📌 UPDATE Node Template
export async function PATCH(req: NextRequest) {
  const { content, type, workflowId, channels, accessToken, notionDbId } = await req.json()

  if (!workflowId || !type) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const updateData: any = {}

  if (type === 'Discord') {
    updateData.discordTemplate = content
  } else if (type === 'Slack') {
    updateData.slackTemplate = content
    updateData.slackAccessToken = accessToken
    if (channels) {
      const existingChannels = await db.workflows.findUnique({
        where: { id: workflowId },
        select: { slackChannels: true },
      })

      const nonDuplicatedChannels = [
        ...new Set([...(existingChannels?.slackChannels || []), ...channels.map((c: Option) => c.value)]),
      ]

      updateData.slackChannels = nonDuplicatedChannels
    }
  } else if (type === 'Notion') {
    updateData.notionTemplate = content
    updateData.notionAccessToken = accessToken
    updateData.notionDbId = notionDbId
  }

  const updatedWorkflow = await db.workflows.update({
    where: { id: workflowId },
    data: updateData,
  })

  return NextResponse.json({ message: `${type} template saved`, workflow: updatedWorkflow })
}