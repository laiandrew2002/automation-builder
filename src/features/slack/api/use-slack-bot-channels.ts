import { useQuery } from "@tanstack/react-query";

export const useSlackBotChannels = (slackAccessToken: string) => {
  return useQuery({
    queryKey: ['slackChannels', slackAccessToken],
    queryFn: async () => {
      if (!slackAccessToken) return [];
      const res = await fetch(`/api/slack/channels?slackAccessToken=${slackAccessToken}`)
      if (!res.ok) throw new Error('Failed to fetch Slack connection')
      return res.json()
    },
    enabled: !!slackAccessToken, // Only fetch if slackAccessToken exists
  })
}