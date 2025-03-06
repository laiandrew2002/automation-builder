/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * GET /api/slack/channels
 * Fetches bot channels from Slack
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slackAccessToken = searchParams.get('slackAccessToken');

    if (!slackAccessToken) {
      return NextResponse.json({ error: 'Missing slackAccessToken' }, { status: 400 });
    }

    const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
      types: 'public_channel,private_channel',
      limit: '200',
    })}`;

    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    });

    if (!data.ok) throw new Error(data.error);
    if (!data?.channels?.length) return NextResponse.json([], { status: 200 });

    const channels = data.channels
      .filter((ch: any) => ch.is_member)
      .map((ch: any) => ({ label: ch.name, value: ch.id }));

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error('Error listing bot channels:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}