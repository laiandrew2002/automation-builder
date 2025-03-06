import { useQuery } from "@tanstack/react-query";

export const useConnectSlack = (userId: string) => {
  return useQuery({
    queryKey: ['slackConnection', userId],
    queryFn: async () => {
      const res = await fetch('/api/slack', {
        headers: { userId },
      })
      if (!res.ok) throw new Error('Failed to fetch Slack connection')
      return res.json()
    },
    enabled: !!userId, // Only fetch if userId exists
  })
}