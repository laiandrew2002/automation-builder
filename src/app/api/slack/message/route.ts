import { NextResponse } from 'next/server';
import axios from 'axios';

/**
 * POST /api/slack/message
 * Sends a message to Slack channels
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slackAccessToken, selectedSlackChannels, content } = body;

    if (!content) {
      return NextResponse.json({ message: 'Content is empty' }, { status: 400 });
    }

    if (!selectedSlackChannels?.length) {
      return NextResponse.json({ message: 'Channel not selected' }, { status: 400 });
    }

    await Promise.all(
      selectedSlackChannels.map(async (channel: { value: string }) => {
        await axios.post(
          'https://slack.com/api/chat.postMessage',
          { channel: channel.value, text: content },
          {
            headers: {
              Authorization: `Bearer ${slackAccessToken}`,
              'Content-Type': 'application/json;charset=utf-8',
            },
          }
        );
      })
    );

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error posting message to Slack:', error);
    return NextResponse.json({ message: 'Message could not be sent to Slack' }, { status: 500 });
  }
}