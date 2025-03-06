import { useQuery } from "@tanstack/react-query";

export const useGetDiscordWebhook = (userId: string) => {
  return useQuery({
    queryKey: ['discordWebhook', { userId }],
    queryFn: async () => {
      const res = await fetch('/api/discord', {
        headers: {
          "userId": userId,
        }
      });
      if (!res.ok) throw new Error('Failed to fetch webhook details')
      return res.json()
    },
    enabled: !!userId,
  })
}