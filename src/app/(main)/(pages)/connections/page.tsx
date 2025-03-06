/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { CONNECTIONS } from "@/lib/constant";
import React from "react";
import ConnectionCard from "./_components/ConnectionCard";
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

  const { user: userClerk } = useUser();
  const useDiscordConnection = useConnectDiscordWebhook();
  const useNotionConnection = useConnectNotion();
  const useSlackConnection = useConnectSlack();
  const userQuery = useGetUser(userClerk?.id || '');
  const user = userQuery.data;
  const isLoading = userQuery.isPending || userQuery.isLoading;
  // if (!user) return null;

  const onUserConnections = async () => {
    useDiscordConnection.mutate({
      channel_id,
      webhook_id,
      webhook_name,
      webhook_url,
      user_id: user.id,
      guild_name,
      guild_id,
    } as any);

    useNotionConnection.mutate({
      access_token,
      workspace_id,
      workspace_icon,
      workspace_name,
      database_id,
      id: user.id,
    } as any);
    
    useSlackConnection.mutate({
      app_id,
      authed_user_id,
      authed_user_token,
      slack_access_token,
      bot_user_id,
      team_id,
      team_name,
      user_id: user.id,
    } as any);

    const connections: any = {}

    // const user_info = await getUserData(user.id)
    const user_info = user

    //get user info with all connections
    user_info?.connections.map((connection: { type: string | number; }) => {
      connections[connection.type] = true
      return (connections[connection.type] = true)
    })

    // Google Drive connection will always be true
    // as it is given access during the login process
    return { ...connections, 'Google Drive': true }
  }

  // const connections = await onUserConnections()

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
              connected={onUserConnections}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Connections;
