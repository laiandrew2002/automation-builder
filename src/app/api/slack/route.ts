import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      app_id,
      authed_user_id,
      authed_user_token,
      slack_access_token,
      bot_user_id,
      team_id,
      team_name,
      user_id,
    } = body;

    if (!slack_access_token) {
      return NextResponse.json({ error: 'Missing slack_access_token' }, { status: 400 });
    }

    // Check if the Slack connection already exists
    const slackConnection = await db.slack.findFirst({
      where: { slackAccessToken: slack_access_token },
      include: { connections: true },
    });

    if (!slackConnection) {
      await db.slack.create({
        data: {
          userId: user_id,
          appId: app_id,
          authedUserId: authed_user_id,
          authedUserToken: authed_user_token,
          slackAccessToken: slack_access_token,
          botUserId: bot_user_id,
          teamId: team_id,
          teamName: team_name,
          connections: {
            create: { userId: user_id, type: 'Slack' },
          },
        },
      });
    }

    return NextResponse.json({ message: 'Slack connected successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error connecting Slack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const userId = req.headers.get("userId");

  try {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slackConnection = await db.slack.findFirst({
      where: { userId },
    });

    if (!slackConnection) {
      return NextResponse.json({ error: 'No Slack connection found' }, { status: 404 });
    }

    return NextResponse.json(slackConnection, { status: 200 });
  } catch (error) {
    console.error('Error fetching Slack connection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}