/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { CONNECTIONS } from "@/lib/constant";
import React, { useCallback, useEffect, useState } from "react";
import ConnectionCard from "./_components/connection-card";
import { useUser } from "@clerk/nextjs";
import { useConnectDiscordWebhook } from "@/features/discord/api/use-discord-connect";
import { useGetUser } from "@/features/user/api/use-get-user";
import { Loader2 } from "lucide-react";
import { useConnectNotion } from "@/features/notion/api/use-notion-connect";
import { useConnectSlack } from "@/features/slack/api/use-slack-connect";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

const Connections = (props: Props) => {
  const {
    webhook_id,
    webhook_name,
    webhook_url,
    guild_id,
    guild_name,
    channel_id,
    access_token,
    workspace_name,
    workspace_icon,
    workspace_id,
    database_id,
    app_id,
    authed_user_id,
    authed_user_token,
    slack_access_token,
    bot_user_id,
    team_id,
    team_name,
  } = props.searchParams ?? {
    webhook_id: "",
    webhook_name: "",
    webhook_url: "",
    guild_id: "",
    guild_name: "",
    channel_id: "",
    access_token: "",
    workspace_name: "",
    workspace_icon: "",
    workspace_id: "",
    database_id: "",
    app_id: "",
    authed_user_id: "",
    authed_user_token: "",
    slack_access_token: "",
    bot_user_id: "",
    team_id: "",
    team_name: "",
  };
  const [connections, setConnections] = useState<any>({
    'Google Drive': false,
    'Discord': false,
    'Notion': false,
    'Slack': false,
  });
  const { user: userClerk } = useUser();
  const useDiscordConnection = useConnectDiscordWebhook();
  const useNotionConnection = useConnectNotion();
  const useSlackConnection = useConnectSlack();
  const userQuery = useGetUser(userClerk?.id || '');
  const user = userQuery.data;

  const isLoading = userQuery.isPending || userQuery.isLoading;
  
  const onUserConnections = useCallback(async () => {
    if (!userClerk?.id) return;

    useDiscordConnection.mutate(
      {
        channel_id,
        webhook_id,
        webhook_name,
        webhook_url,
        user_id: userClerk?.id,
        guild_name,
        guild_id,
      } as any,
      { onSuccess: () => userQuery.refetch() }
    );

    useNotionConnection.mutate(
      {
        access_token,
        workspace_id,
        workspace_icon,
        workspace_name,
        database_id,
        id: userClerk?.id,
      } as any,
      { onSuccess: () => userQuery.refetch() }
    );
    
    useSlackConnection.mutate(
      {
        app_id,
        authed_user_id,
        authed_user_token,
        slack_access_token,
        bot_user_id,
        team_id,
        team_name,
        user_id: userClerk?.id,
      } as any,
      { onSuccess: () => userQuery.refetch() }
    );

    const updatedConnections: Record<string, boolean> = {};

    //get user info with all connections
    user?.connections?.forEach((connection: { type: string }) => {
      updatedConnections[connection.type] = true;
    });

    console.log('connections', connections)
    // Google Drive connection will always be true
    // as it is given access during the login process
    updatedConnections["Google Drive"] = true;

    setConnections(updatedConnections);
  }, [userClerk?.id, user?.connections]);

  useEffect(() => {
    if (user) {
      onUserConnections();
    }
  }, [user, onUserConnections]);

  if (isLoading) return <div><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>

  return (
    <div className="relative flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Connections
      </h1>
      <div className="relative flex flex-col gap-4">
        <section className="grid lg:grid-cols-2 p-6 gap-6 text-muted-foreground">
          <p className="lg:col-span-2">
            Connect all your apps directly from here. You may need to connect
            these apps regularly to refresh verification
          </p>
          {CONNECTIONS.map((connection) => (
            <ConnectionCard
              key={connection.title}
              title={connection.title}
              icon={connection.image}
              type={connection.title}
              description={connection.description}
              connected={connections}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Connections;
